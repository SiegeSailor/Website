import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { site } from "@/setting";

export async function getArticles() {
  const directory = path.join(process.cwd(), site.article.path);
  const filenames = fs.readdirSync(directory);

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
  const filePath = path.join(process.cwd(), site.article.path, filename);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { content, data } = matter(fileContents);
  const contents = content.split("<!-- description -->");

  return {
    content: `# ${data.title} ${contents.join("")}`,
    filename,
    metadata: {
      date,
      tags: (data.tags as string[]).map((tag: string) => tag.trim()),
      title: data.title,
      description: contents[0].trim(),
    },
  };
}

export async function getArticleBySlug(slug: string) {
  const filename = `${slug}.md`;
  return getArticleByFilename(filename);
}
