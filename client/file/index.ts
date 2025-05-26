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
  const date = filename.split(".")[0];
  const filePath = join(process.cwd(), DOMAIN_PATH.article, filename);
  const fileContents = readFileSync(filePath, "utf8");
  const { content: source, data } = matter(fileContents);

  const sources = source.split("<!-- description -->");
  const content = sources.join("").trim();

  return {
    content,
    filename,
    metadata: {
      date,
      tags: (data.tags as string[]).map((tag: string) => tag.trim()),
      title: data.title,
      description: sources[0].trim(),
      minutes: Math.ceil((content.split(" ").length + 1) / 200),
    },
  };
}

export async function getArticleByDate(date: string) {
  const filename = `${date}.md`;
  return getArticleByFilename(filename);
}
