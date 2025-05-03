import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { PATH_ARTICLE } from "@/setting";

export async function getArticles() {
  const directory = path.join(process.cwd(), PATH_ARTICLE);
  const filenames = fs.readdirSync(directory);

  return filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const filePath = path.join(directory, filename);
      const fileContents = fs.readFileSync(filePath, "utf8");
      const { data: metadata } = matter(fileContents);

      return { filename, metadata };
    });
}

export async function getArticle(slug: string) {
  const filename = `${slug}.md`;
  const filePath = path.join(process.cwd(), PATH_ARTICLE, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data: metadata } = matter(fileContents);

  return { filename, metadata, content };
}
