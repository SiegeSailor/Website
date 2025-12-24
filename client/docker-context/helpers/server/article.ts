"use server";

import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import { Route } from "next";
import matter from "gray-matter";

import { getSlugByTitle } from "@/helpers/utility";
import { getStatisticByFilePath } from "@/helpers/server/file";
import { getAnchorsByContent } from "@/helpers/article";
import {
  TECHNOLOGIES,
  TECHNOLOGY_SET,
  STATUS,
  STATUS_SET,
  TITLE_TO_ROUTE,
} from "@/settings/constant";

export type TArticle = Awaited<ReturnType<typeof getArticles>>[number];

export async function getArticles() {
  const directory = join(process.cwd(), "public/article");
  const filenames = readdirSync(directory);

  const articles = await Promise.all(
    filenames
      .filter((filename) => /^\d{4}-\d{2}-\d{2}\.md$/.test(filename))
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
    const filePath = join(process.cwd(), "public/article", filename);
    const fileContents = readFileSync(filePath, "utf8");
    const { content: source, data } = matter(fileContents);

    const sources = source.split("<!-- description -->");
    const description = sources[0]?.trim();
    const content = sources[1]?.trim();
    const technologies: typeof TECHNOLOGIES = data.technologies
      .map((technology: string) => technology.trim())
      .sort();
    const status: (typeof STATUS)[number] = data.status;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date))
      throw new Error("Date format must be YYYY-MM-DD");
    if (typeof description !== "string" || description.length === 0)
      throw new Error("Description must be a non-empty string");
    if (typeof content !== "string" || content.length === 0)
      throw new Error("Content must be a non-empty string");
    if (!Array.isArray(data.technologies) || data.technologies.length === 0)
      throw new Error("Technologies must be an array of non-empty strings");
    if (!data.technologies.every((item) => TECHNOLOGY_SET.has(item)))
      throw new Error("Each technology must be valid");
    if (typeof data.title !== "string" || data.title.length === 0)
      throw new Error("Title must be a non-empty string");
    if (typeof data.category !== "string" || data.category.length === 0)
      throw new Error("Category must be a non-empty string");
    if (!STATUS_SET.has(data.status)) throw new Error("Status must be valid");

    const identifierArticle = getSlugByTitle(data.title);
    const anchors: ReturnType<typeof getAnchorsByContent> = [
      {
        level: 1,
        title: data.title,
        identifier: identifierArticle,
        route: `${TITLE_TO_ROUTE.Blog}#${identifierArticle}`,
      },
      ...getAnchorsByContent(content, TITLE_TO_ROUTE.Blog),
    ];

    const statistics = await getStatisticByFilePath(filePath);

    return {
      content,
      filename,
      metadata: {
        anchors,
        category: data.category,
        createdOn: statistics.createdOn,
        date,
        description,
        minutes: Math.ceil((source.split(" ").length + 1) / 150),
        route: `${TITLE_TO_ROUTE.Blog}/${date}` as Route,
        status,
        technologies,
        title: data.title,
        updatedOn: statistics.updatedOn,
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
