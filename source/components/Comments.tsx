"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

type TComment = Readonly<{
  id: string;
  parentId: string | null;
  name: string;
  body: string;
  isAuthor: boolean;
  createdAt: string;
}>;

type TStatus = Readonly<{ isError: boolean; text: string }>;

// Served by the comments API behind the same CloudFront distribution;
// `npm run watch` proxies it to the live site (see next.config.mjs).
const ENDPOINT = "/api/comments";
const LIMIT_NAME = 50;
const LIMIT_BODY = 2000;

const CLASS_LABEL =
  "font-mono text-[0.65rem] uppercase tracking-[0.18em] text-default-500";
const CLASS_FIELD =
  "w-full rounded-small border border-default-200 bg-background px-3 py-2 text-small outline-none transition-colors focus:border-primary";
const CLASS_TAB =
  "font-mono text-[0.65rem] uppercase tracking-[0.18em] transition-colors";

// Comments are untrusted. remark-html sanitizes with GitHub's own allow-list by
// default, which drops raw HTML, event handlers, and `javascript:` links.
const processor = remark().use(remarkGfm).use(remarkHtml);
const toHtml = (markdown: string) =>
  String(processor.processSync(markdown)).replaceAll(
    '<a href="http',
    '<a rel="nofollow ugc noopener noreferrer" target="_blank" href="http',
  );

function Markdown({ source }: Readonly<{ source: string }>) {
  return (
    <div
      className="markdown-comment"
      dangerouslySetInnerHTML={{ __html: toHtml(source) }}
    />
  );
}

function Comment({
  comment,
  children,
}: Readonly<{ comment: TComment; children?: ReactNode }>) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-wrap items-baseline gap-x-2.5">
        <span className="text-small font-semibold">{comment.name}</span>
        {comment.isAuthor && (
          <span className="rounded-full border border-primary-200 dark:border-primary-700 px-1.5 font-mono text-[0.6rem] tracking-[0.14em] text-primary">
            AUTHOR
          </span>
        )}
        <span className="font-mono text-tiny text-default-500">
          {comment.createdAt.slice(0, 10)}
        </span>
      </div>
      <Markdown source={comment.body} />
      {children}
    </div>
  );
}

export default function ({ post }: Readonly<{ post: string }>) {
  const section = useRef<HTMLElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const [comments, setComments] = useState<TComment[]>();
  const [isHeld, setIsHeld] = useState(false);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [parent, setParent] = useState<TComment>();
  const [isPreview, setIsPreview] = useState(false);
  const [status, setStatus] = useState<TStatus>();
  const [isSending, setIsSending] = useState(false);

  // Fetched on load rather than on scroll, so comments are in place before a
  // reader reaches them instead of pushing the footer down under them.
  useEffect(() => {
    let isCurrent = true;
    fetch(`${ENDPOINT}?post=${post}`)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json() as Promise<{ comments: TComment[] }>;
      })
      .then((data) => {
        if (!isCurrent) return;
        // A reader who got here first would see them push the page down, so
        // they wait behind a button of the same height as the loading line.
        const top = section.current?.getBoundingClientRect().top ?? Infinity;
        setIsHeld(data.comments.length > 0 && top < window.innerHeight);
        setComments(data.comments);
      })
      .catch(() => isCurrent && setIsUnavailable(true));

    return () => {
      isCurrent = false;
    };
  }, [post]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim())
      return setStatus({
        isError: true,
        text: "Add a name so readers know who wrote it.",
      });
    if (!body.trim())
      return setStatus({
        isError: true,
        text: "Write a comment before posting.",
      });

    setIsSending(true);
    let text = "The comment could not be sent. Try again later.";
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post,
          parentId: parent?.id ?? null,
          name,
          body,
          website,
        }),
      });
      if (response.ok) {
        setStatus({
          isError: false,
          text: `Thanks, ${name.trim()}. Your comment will show here once it's approved.`,
        });
        setBody("");
        setParent(undefined);
        setIsPreview(false);
        return;
      }
      if (response.status === 429)
        text = "Too many comments right now. Try again in a minute.";
      else if (response.status === 400)
        text = ((await response.json()) as { error?: string }).error ?? text;
    } catch {
      // A network failure keeps the generic message.
    } finally {
      setIsSending(false);
    }
    setStatus({ isError: true, text });
  };

  const tops = comments?.filter((comment) => !comment.parentId) ?? [];

  return (
    <section
      ref={section}
      id="comments"
      aria-labelledby="comments-title"
      className="mt-10 pt-6 border-t border-default-200 flex flex-col gap-5"
    >
      <h2 id="comments-title" className={CLASS_LABEL}>
        Comments{comments ? ` · ${comments.length}` : ""}
      </h2>

      {/* One line in every state, so the answer never changes the height. */}
      {(!tops.length || isHeld) && (
        <p className="text-small text-default-500">
          {isHeld ? (
            <button
              type="button"
              onClick={() => setIsHeld(false)}
              className="text-primary underline underline-offset-4"
            >
              Show {comments?.length} comments
            </button>
          ) : isUnavailable ? (
            "Comments are unavailable right now."
          ) : comments ? (
            "No comments yet."
          ) : (
            "Loading comments…"
          )}
        </p>
      )}

      {!isHeld &&
        tops.map((top) => (
          <Comment key={top.id} comment={top}>
            <button
              type="button"
              onClick={() => {
                setParent(top);
                setIsPreview(false);
                field.current?.focus();
              }}
              className="self-start font-mono text-tiny text-default-500 hover:text-foreground"
            >
              Reply
            </button>
            {comments
              ?.filter((reply) => reply.parentId === top.id)
              .map((reply) => (
                <div
                  key={reply.id}
                  className="mt-4 ml-3.5 pl-3.5 border-l border-default-200"
                >
                  <Comment comment={reply} />
                </div>
              ))}
          </Comment>
        ))}

      {/* Rendered before the comments arrive, so nothing appears late. */}
      <form
        onSubmit={submit}
        noValidate
        className="flex flex-col gap-2.5 rounded-medium border border-default-200 p-3.5"
      >
        {parent && (
          <p className="flex gap-3 text-small text-default-500">
            Replying to {parent.name}
            <button
              type="button"
              onClick={() => setParent(undefined)}
              className="text-primary underline underline-offset-4"
            >
              Cancel
            </button>
          </p>
        )}
        <label htmlFor="comment-name" className={CLASS_LABEL}>
          Name
        </label>
        <input
          id="comment-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={LIMIT_NAME}
          autoComplete="nickname"
          className={CLASS_FIELD}
        />
        <div className="flex items-baseline gap-4">
          <label
            htmlFor="comment-body"
            className={clsx(CLASS_LABEL, "mr-auto")}
          >
            Comment
          </label>
          {(["Write", "Preview"] as const).map((tab) => {
            const isActive = (tab === "Preview") === isPreview;
            return (
              <button
                key={tab}
                type="button"
                aria-pressed={isActive}
                onClick={() => setIsPreview(tab === "Preview")}
                className={clsx(
                  CLASS_TAB,
                  isActive
                    ? "text-foreground underline underline-offset-4"
                    : "text-default-500 hover:text-foreground",
                )}
              >
                {tab}
              </button>
            );
          })}
        </div>
        {/* Hidden rather than unmounted, so a resized box keeps its size. */}
        <textarea
          id="comment-body"
          ref={field}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={LIMIT_BODY}
          rows={4}
          hidden={isPreview}
          className={clsx(CLASS_FIELD, "min-h-28 resize-y")}
        />
        {isPreview && (
          <div className={clsx(CLASS_FIELD, "min-h-28")}>
            {body.trim() ? (
              <Markdown source={body} />
            ) : (
              <p className="text-default-500">Nothing to preview.</p>
            )}
          </div>
        )}
        {/* Hidden from people; a bot that fills it is dropped by the API. */}
        <input
          name="website"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
          className="hidden"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-tiny text-default-500">
            GitHub Markdown. Comments appear after review. {body.length} /{" "}
            {LIMIT_BODY}
          </span>
          <button
            type="submit"
            disabled={isSending || isUnavailable}
            className="rounded-small bg-primary px-3.5 py-1.5 text-small text-primary-foreground transition-opacity disabled:opacity-disabled"
          >
            {isSending ? "Posting…" : "Post comment"}
          </button>
        </div>
        <p
          role="status"
          className={
            status?.isError
              ? "min-h-5 text-small text-warning"
              : "min-h-5 text-small text-primary"
          }
        >
          {status?.text}
        </p>
      </form>
    </section>
  );
}
