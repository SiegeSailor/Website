import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";

import { DOMAIN_PATH } from "@/setting/site";

export async function getArticles() {
  const directory = join(process.cwd(), DOMAIN_PATH.article);
  const filenames = readdirSync(directory);

  const articles = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => await getArticleByFilename(filename))
  );

  return articles.sort(
    (left, right) =>
      new Date(right.metadata.date).getTime() -
      new Date(left.metadata.date).getTime()
  );
}

export async function getArticleByFilename(filename: string) {
  try {
    const date = filename.split(".")[0];
    const filePath = join(process.cwd(), DOMAIN_PATH.article, filename);
    const fileContents = readFileSync(filePath, "utf8");
    const { content: source, data } = matter(fileContents);

    const sources = source.split("<!-- description -->");
    const description = sources[0].trim();
    const content = sources.join("").trim();

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error("Date format must be YYYY-MM-DD");
    if (!Array.isArray(data.tags))
      throw new Error("Tags must be an array of non-empty strings");
    if (!data.tags.every((tag) => typeof tag === "string" && tag.length > 0))
      throw new Error("Each tag must be a non-empty string");
    if (typeof data.title !== "string" || data.title.length === 0)
      throw new Error("Title must be a non-empty string");
    if (typeof description !== "string" || description.length === 0)
      throw new Error("Description must be a non-empty string");
    if (typeof content !== "string" || content.length === 0)
      throw new Error("Content must be a non-empty string");

    return {
      content,
      filename,
      metadata: {
        date,
        tags: data.tags.map((tag: string) => tag.trim()),
        title: data.title,
        description,
        minutes: Math.ceil((content.split(" ").length + 1) / 200),
      },
    };
  } catch (_) {
    const error = _ as Error;
    throw new Error(
      `Article Parsing Error: ${error.message} (reading ${filename})`
    );
  }
}

export async function getArticleByDate(date: string) {
  const filename = `${date}.md`;
  return getArticleByFilename(filename);
}
