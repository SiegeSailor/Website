import { Card, Chip, Divider } from "@heroui/react";
import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getArticles, getArticleByDate } from "@/helper/server/article";
import { getSlugByTitle } from "@/helper/utility";
import { STATUS_COLOR } from "@/setting/site";
import Heading from "@/component/Heading";
import ListboxArticles from "@/component/ListboxArticles";
import ListboxContents, { IDENTIFIER } from "@/component/ListboxContents";
import Markdown from "@/component/Markdown";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";

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
  const articles = await getArticles();
  const { slug } = await params;
  const { content, metadata } = await getArticleByDate(slug);

  return (
    <section className={clsx("max-w-content mx-auto p-4")}>
      <div
        className={clsx(
          "gap-12 grid grid-cols-1 md:grid-cols-12 gird-rows-1",
          "w-full"
        )}
      >
        <div
          id={IDENTIFIER}
          className={clsx(
            "md:col-span-8 lg:col-span-9",
            "max-h-[calc(100vh-12rem)] overflow-y-auto"
          )}
        >
          <div className="flex flex-col gap-4 mb-16">
            <Heading level={1} id={getSlugByTitle(metadata.title)}>
              {metadata.title}
            </Heading>
            <div
              className={clsx(
                "flex flex-wrap gap-1 items-center",
                "text-nowrap font-normal text-sm",
                "opacity-60"
              )}
            >
              <span>{metadata.date} (Drafted)</span>
              <span>·</span>
              <span>{metadata.createdOn} (Created)</span>
              <span>·</span>
              <span>{metadata.updatedOn} (Updated)</span>
              <span>·</span>
              <span>{metadata.minutes} min read</span>
            </div>
            <div className="flex gap-2 items-center">
              <Chip
                size="md"
                variant="flat"
                color={STATUS_COLOR[metadata.status]}
              >
                {metadata.status}
              </Chip>
              <span>·</span>
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
            <Divider className="mt-4" />
            <div className="my-2">
              <Markdown source={metadata.description} />
            </div>
            <Divider />
          </div>

          <article>
            <Markdown source={content} />
          </article>
        </div>
        <div
          className={clsx(
            "hidden md:block md:col-span-4 lg:col-span-3",
            "max-h-[calc(100vh-12rem)] overflow-y-auto",
            "p-1"
          )}
        >
          {[
            <Card shadow="sm">
              <ListboxContents anchors={metadata.anchors} />
            </Card>,
            <Card shadow="sm">
              <ListboxArticles date={metadata.date} articles={articles} />
            </Card>,
          ].map((item, index) => (
            <div key={index} className="mb-4">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
