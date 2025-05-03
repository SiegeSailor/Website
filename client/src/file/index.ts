import fs from "fs";
import path from "path";
import matter from "front-matter";

export const revalidate = 0;

export async function getArticles() {
  const directory = path.join(process.cwd(), "public/article");
  const filenames = fs.readdirSync(directory);

  return filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const content = fs.readFileSync(path.join(directory, filename), "utf8");
      const { attributes } = matter<{ title: string; tags: string[] }>(content);
      return {
        filename,
        metadata: {
          ...attributes,
          date: filename.split(".")[0],
        },
      };
    });
}

export async function getArticle(filename: string) {
  const directory = path.join(process.cwd(), "public/article");
  const filePath = path.join(directory, filename);
  const content = fs.readFileSync(filePath, "utf8");
  const { attributes, body } = matter<{ title: string; tags: string[] }>(
    content
  );

  return {
    filename,
    metadata: {
      ...attributes,
      date: filename.split(".")[0],
    },
    body,
  };
}

export async function getLatestArticle() {
  const articles = await getArticles();
  return articles.sort(
    (left, right) =>
      new Date(right.metadata.date).getTime() -
      new Date(left.metadata.date).getTime()
  )[0];
}
