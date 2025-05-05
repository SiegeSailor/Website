import { generateTitle } from "@/helper";
import { getArticles, getArticleBySlug } from "@/file";
import Markdown from "@/component/Markdown";

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
  const article = await getArticleBySlug(slug);

  return {
    title: generateTitle(article.metadata.title, "Blog"),
    description: article.metadata.description,
  };
}

export default async function ({ params }: { params: Promise<TParams> }) {
  const { slug } = await params;
  const { metadata, content } = await getArticleBySlug(slug);

  return (
    <div>
      <h1>{metadata.title}</h1>
      <p>{metadata.date}</p>
      <article>
        <Markdown source={content} />
      </article>
    </div>
  );
}
