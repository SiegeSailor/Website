import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getArticles, getArticleByDate } from "@/helper/article";
import { TParams } from "@/app/(child)/blog/[slug]/layout";
import Markdown from "@/component/Markdown";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

export const dynamicParams = false;

export async function generateStaticParams(): Promise<TParams[]> {
  const articles = await getArticles();

  return articles.map((article) => ({
    slug: article.metadata.date,
  }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<TParams>;
}>): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleByDate(slug);

  return {
    title: generateTitle(article.metadata.title, "Blog"),
    description: article.metadata.description,
  };
}

export default async function ({
  params,
}: Readonly<{ params: Promise<TParams> }>) {
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
          <span>{metadata.date}</span>·
          <span>{metadata.minutes} Minutes Read</span>
        </div>

        <h2 id={metadata.title} className="font-medium text-4xl mb-2">
          {metadata.title}
        </h2>

        <div className="mb-4">
          <ScrollShadowTechnologies
            technologies={metadata.technologies}
            propsItem={{
              className: "text-foreground",
              variant: "bordered",
              size: "md",
            }}
            propsIcon={{ color: "default" }}
          />
        </div>
      </div>

      <article>
        <Markdown source={content} />
      </article>
    </section>
  );
}
