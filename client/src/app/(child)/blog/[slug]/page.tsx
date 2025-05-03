import { MDXRemote } from "next-mdx-remote/rsc";

import { getArticles, getArticle } from "@/file";
import { generateTitle } from "@/helper";

export const dynamicParams = false;

type TParams = { slug: string };

export async function generateStaticParams(): Promise<TParams[]> {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.filename.replace(".md", ""),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<TParams>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);

  return {
    title: generateTitle(article.metadata.title, "Blog"),
    description: article?.metadata.description || "A blog post on my website",
  };
}

export default async function ({ params }: { params: Promise<TParams> }) {
  const { slug } = await params;
  const { metadata, content } = await getArticle(slug);

  return (
    <div>
      <h1>{metadata.title}</h1>
      <p>{metadata.date}</p>
      <article>
        <MDXRemote source={content} components={{}} />
      </article>
    </div>
  );
}
