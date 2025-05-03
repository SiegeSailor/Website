import { getArticles } from "@/file";

export const dynamicParams = false;

type TParams = { slug: string };

export async function generateStaticParams(): Promise<TParams[]> {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.filename.replace(".md", ""),
  }));
}

export default async function ({ params }: { params: Promise<TParams> }) {}
