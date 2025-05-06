import { Divider } from "@heroui/react";
import clsx from "clsx";

import { generateTitle } from "@/helper";
import { getArticles, getArticleByDate } from "@/file";
import Markdown from "@/component/Markdown";
import ScrollShadowTags from "@/component/ScrollShadowTags";

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
  const article = await getArticleByDate(slug);

  return {
    title: generateTitle(article.metadata.title, "Blog"),
    description: article.metadata.description,
  };
}

export default async function ({ params }: { params: Promise<TParams> }) {
  const { slug } = await params;
  const { metadata, content } = await getArticleByDate(slug);

  return (
    <section>
      <div className="flex flex-col gap-2 mb-8">
        <div
          className={clsx(
            "flex gap-2 items-center",
            "text-nowrap font-normal text-sm",
            "opacity-60"
          )}
        >
          <p>{metadata.date}</p>·<p>{metadata.minutes} Minutes Read</p>
        </div>
        <h2 className="font-medium text-3xl mb-4">{metadata.title}</h2>
        <ScrollShadowTags
          tags={metadata.tags}
          propsChip={{ className: "text-foreground" }}
        />
      </div>

      <article>
        <Markdown source={content} />
      </article>
    </section>
  );
}
