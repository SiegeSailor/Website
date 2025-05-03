import { MDXRemote } from "next-mdx-remote/rsc";

import { getArticles, getArticle } from "@/file";

export const dynamicParams = false;

type TParams = { slug: string };
// TODO: TailwindCSS , don't use src
export async function generateStaticParams(): Promise<TParams[]> {
  const articles = await getArticles();
  return articles.map((article) => ({
    slug: article.filename.replace(".md", ""),
  }));
}

export default async function ({ params }: { params: Promise<TParams> }) {
  const { slug } = await params;
  const { metadata, content } = await getArticle(slug);

  return (
    <div>
      <h1>{metadata.title}</h1>
      <p>{metadata.date}</p>
      <article>
        <MDXRemote source={content} />
      </article>
    </div>
  );
}
