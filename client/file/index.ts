import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { site } from "@/setting";

export async function getArticles() {
  const directory = path.join(process.cwd(), site.article.path);
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
  const filePath = path.join(process.cwd(), site.article.path, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data: metadata } = matter(fileContents);

  return { filename, metadata, content };
}
