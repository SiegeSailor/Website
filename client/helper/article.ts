import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";

import { DOMAIN_PATH } from "@/setting/site";
import { getEntries } from "@/helper/utility";
import { TECHNOLOGY_ICON } from "@/setting/icon";

const STATUS = ["Draft", "Writing", "Published", "Archived"] as const;
const STATUS_SET = new Set(STATUS);
const TECHNOLOGIES = getEntries(TECHNOLOGY_ICON).map(([key]) => key);
const TECHNOLOGY_SET = new Set(TECHNOLOGIES);

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
    if (!Array.isArray(data.technologies) || data.technologies.length === 0)
      throw new Error("Technologies must be an array of non-empty strings");
    if (!data.technologies.every((item) => TECHNOLOGY_SET.has(item)))
      throw new Error("Each technology must be valid");
    if (typeof data.title !== "string" || data.title.length === 0)
      throw new Error("Title must be a non-empty string");
    if (typeof description !== "string" || description.length === 0)
      throw new Error("Description must be a non-empty string");
    if (typeof content !== "string" || content.length === 0)
      throw new Error("Content must be a non-empty string");
    if (typeof data.category !== "string" || data.category.length === 0)
      throw new Error("Category must be a non-empty string");
    if (!STATUS_SET.has(data.status)) throw new Error("Status must be valid");

    return {
      content,
      filename,
      metadata: {
        category: data.category,
        date,
        description,
        minutes: Math.ceil((content.split(" ").length + 1) / 200),
        status: data.status as (typeof STATUS)[number],
        technologies: data.technologies
          .map((technology) => technology.trim())
          .sort() as typeof TECHNOLOGIES,
        title: data.title,
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
