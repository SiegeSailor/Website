import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";

import {
  DOMAIN_PATH,
  TECHNOLOGIES,
  TECHNOLOGY_SET,
  STATUS,
  STATUS_SET,
} from "@/setting/site";

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
        anchors: getAnchorsByContent(content),
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

export function getAnchorsByContent(content: string) {
  const lines = content.split("\n");
  const result: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    title: string;
    identifier: string;
  }[] = [];

  const slugCount: Record<string, number> = {};
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.*)/);
    if (match) {
      const level = match[1].length as (typeof result)[number]["level"];
      if (level < 1 || level > 6) continue;
      const title = match[2].trim();
      if (title.length === 0) continue;

      const baseSlug = title.toLowerCase().replace(/\s+/g, "-");
      let identifier = baseSlug;
      if (baseSlug in slugCount) {
        slugCount[baseSlug] += 1;
        identifier = `${baseSlug}-${slugCount[baseSlug]}`;
      } else {
        slugCount[baseSlug] = 0;
      }

      result.push({
        level,
        title,
        identifier,
      });
    }
  }

  return result;
}
