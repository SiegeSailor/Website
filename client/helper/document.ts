import { readFileSync, statSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

import { DOMAIN_PATH, AUTHOR } from "@/setting/site";
import { getAnchorsByContent, getSlugByTitle } from "@/helper/article";

export async function getProfile() {
  const filename = "Profile.md";
  const filePath = join(process.cwd(), DOMAIN_PATH.document, filename);
  const fileContents = readFileSync(filePath, "utf8");
  const { content: source, data } = matter(fileContents);

  const sources = source.split("<!-- description -->");
  const description = sources[0]?.trim();
  const content = sources[1]?.trim();

  if (typeof data.picture !== "string" || data.picture.length === 0)
    throw new Error("Picture must be a non-empty string");
  if (typeof description !== "string" || description.length === 0)
    throw new Error("Description must be a non-empty string");

  const anchors: ReturnType<typeof getAnchorsByContent> = [
    { level: 1, title: AUTHOR, identifier: getSlugByTitle(AUTHOR) },
    ...getAnchorsByContent(content),
  ];

  return {
    content,
    filename,
    metadata: {
      anchors,
      description,
      picture: data.picture,
      statistics: statSync(filePath),
      title: AUTHOR,
    },
  };
}
