// Serves /api/comments behind CloudFront. Readers only ever see approved
// comments; every new one is stored as pending and emailed to the owner, who
// approves it with scripts/dynamodb-moderate.sh.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const { DOMAIN, HASH_KEY, ORIGIN_SECRET, TABLE_NAME, TOPIC_ARN } = process.env;

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LIMIT_NAME = 50;
const LIMIT_BODY = 2000;

const database = new DynamoDBClient();
const notifier = new SNSClient();

// CloudFront turns every 403 and 404 into /404.html, so readers only ever get
// 200, 202, 400, or 405 from here.
const respond = (statusCode, body) => ({
  statusCode,
  headers: {
    "Cache-Control": statusCode === 200 ? "public, max-age=60" : "no-store",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const isFromCloudFront = (value = "") => {
  const actual = Buffer.from(value);
  const expected = Buffer.from(ORIGIN_SECRET);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
};

const clean = (value) =>
  typeof value === "string"
    ? value
        .replace(/\r\n?/g, "\n")
        .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
        .trim()
    : "";

const toComment = (item) => ({
  id: item.id.S,
  parentId: item.parentId?.S ?? null,
  name: item.name.S,
  body: item.body.S,
  isAuthor: item.isAuthor?.BOOL ?? false,
  createdAt: item.createdAt.S,
});

async function list(post) {
  if (!DATE.test(post ?? ""))
    return respond(400, { error: "Post must be a YYYY-MM-DD date." });

  const comments = [];
  let ExclusiveStartKey;
  do {
    const page = await database.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "#post = :post",
        FilterExpression: "#status = :approved",
        ExpressionAttributeNames: { "#post": "post", "#status": "status" },
        ExpressionAttributeValues: {
          ":post": { S: post },
          ":approved": { S: "approved" },
        },
        ExclusiveStartKey,
      }),
    );
    comments.push(...page.Items.map(toComment));
    ExclusiveStartKey = page.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return respond(200, { comments });
}

async function create(event) {
  let input;
  try {
    input = JSON.parse(
      event.isBase64Encoded
        ? Buffer.from(event.body, "base64").toString("utf8")
        : event.body,
    );
  } catch {
    return respond(400, { error: "Send the comment as JSON." });
  }
  if (typeof input !== "object" || input === null)
    return respond(400, { error: "Send the comment as JSON." });

  // Honeypot: people never see this field, so anything in it is a bot. Answer
  // as if it worked so the bot learns nothing.
  if (input.website) return respond(202, { status: "pending" });

  const { post } = input;
  const name = clean(input.name);
  const body = clean(input.body);
  const parentId = input.parentId ?? null;

  if (typeof post !== "string" || !DATE.test(post))
    return respond(400, { error: "Post must be a YYYY-MM-DD date." });
  if (!name || name.length > LIMIT_NAME)
    return respond(400, { error: `Name must be 1–${LIMIT_NAME} characters.` });
  if (!body || body.length > LIMIT_BODY)
    return respond(400, { error: "Comment must be 1–2,000 characters." });
  if (parentId !== null) {
    const parent =
      typeof parentId === "string"
        ? await database.send(
            new GetItemCommand({
              TableName: TABLE_NAME,
              Key: { post: { S: post }, id: { S: parentId } },
            }),
          )
        : {};
    if (parent.Item?.status?.S !== "approved" || parent.Item.parentId)
      return respond(400, { error: "That comment cannot be replied to." });
  }

  const createdAt = new Date().toISOString();
  const id = `${createdAt}#${randomBytes(2).toString("hex")}`;
  // `CloudFront-Viewer-Address` is "<ip>:<port>"; the request's own source is
  // CloudFront's edge.
  const address =
    event.headers?.["cloudfront-viewer-address"]?.replace(/:\d+$/, "") ??
    event.requestContext.http.sourceIp;

  await database.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        post: { S: post },
        id: { S: id },
        ...(parentId && { parentId: { S: parentId } }),
        name: { S: name },
        body: { S: body },
        status: { S: "pending" },
        isAuthor: { BOOL: false },
        ipHash: {
          S: createHmac("sha256", HASH_KEY).update(address).digest("hex"),
        },
        createdAt: { S: createdAt },
      },
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );

  // The comment is already stored, so a failed email must not fail the reader.
  try {
    await notifier.send(
      new PublishCommand({
        TopicArn: TOPIC_ARN,
        Subject: `New comment on ${post}`,
        Message: [
          `${name} on https://${DOMAIN}/blog/${post}:`,
          "",
          body,
          "",
          `bash scripts/dynamodb-moderate.sh approve ${post} '${id}'`,
          `bash scripts/dynamodb-moderate.sh reject ${post} '${id}'`,
        ].join("\n"),
      }),
    );
  } catch (error) {
    console.error("Notification failed", error);
  }

  return respond(202, { status: "pending" });
}

export async function handler(event) {
  if (!isFromCloudFront(event.headers?.["x-origin-verify"]))
    return respond(403, { error: "Forbidden." });

  switch (event.requestContext.http.method) {
    case "GET":
      return list(event.queryStringParameters?.post);
    case "POST":
      return create(event);
    default:
      return respond(405, { error: "Method not allowed." });
  }
}
