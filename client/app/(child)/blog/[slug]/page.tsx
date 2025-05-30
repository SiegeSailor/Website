import { Divider, Card } from "@heroui/react";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getArticles, getArticleByDate } from "@/helper/article";
import Markdown from "@/component/Markdown";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

export const dynamicParams = false;

type TParams = Readonly<{ slug: string }>;

export async function generateStaticParams(): Promise<TParams[]> {
  const articles = await getArticles();

  return articles.map((article) => ({
    slug: article.filename.replace(".md", ""),
  }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<TParams>;
}>) {
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
    <section className="p-4">
      <div className="max-w-[880px] mx-auto">
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

          <h2 className="font-medium text-4xl mb-2">{metadata.title}</h2>

          <ScrollShadowTechnologies
            tags={metadata.tags}
            propsChip={{ className: "text-foreground", variant: "faded" }}
            propsScrollShadow={{ className: "mb-4" }}
          />
        </div>

        <article>
          <Markdown source={content} />
        </article>
      </div>
    </section>
  );
}
