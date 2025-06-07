import { Card } from "@heroui/react";
import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import {
  getArticles,
  getArticleByDate,
  getSlugByTitle,
} from "@/helper/article";
import { ScrollShadow } from "@heroui/react";
import Heading from "@/component/Heading";
import Markdown from "@/component/Markdown";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";
import TableOfContents, { IDENTIFIER } from "@/component/TableOfContents";

export const dynamicParams = false;

type TParams = Readonly<{ slug: string }>;

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
    <section className={clsx("max-w-[880px] mx-auto p-4")}>
      <div className={clsx("gap-12 grid grid-cols-12 gird-rows-1")}>
        <div className={clsx("col-span-12 md:col-span-8")}>
          <ScrollShadow
            id={IDENTIFIER}
            className="h-[calc(100vh-12rem)]"
            size={5}
          >
            <div className="flex flex-col gap-2 mb-12">
              <Heading level={1} id={getSlugByTitle(metadata.title)}>
                {metadata.title}
              </Heading>
              <div
                className={clsx(
                  "flex gap-2 items-center",
                  "text-nowrap font-normal text-sm",
                  "opacity-60",
                  "mb-2"
                )}
              >
                <span>{metadata.date}</span>·
                <span>{metadata.minutes} Minutes Read</span>
              </div>
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

            <article>
              <Markdown source={content} />
            </article>
          </ScrollShadow>
        </div>
        <Card shadow="sm" className={clsx("hidden md:block md:col-span-4")}>
          <ScrollShadow className="h-[calc(100vh-12rem)]" size={5}>
            <TableOfContents anchors={metadata.anchors} />
          </ScrollShadow>
        </Card>
      </div>
    </section>
  );
}
