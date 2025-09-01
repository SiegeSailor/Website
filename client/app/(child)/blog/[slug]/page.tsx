import { Card, Chip, Divider } from "@heroui/react";
import { Metadata } from "next";

import { generateTitle } from "@/helper/utility";
import { getArticles, getArticleByDate } from "@/helper/server/article";
import { getSlugByTitle } from "@/helper/utility";
import { STATUS_COLOR } from "@/setting/site";
import Heading from "@/component/Heading";
import ListboxArticles from "@/component/ListboxArticles";
import ListboxContents, { IDENTIFIER } from "@/component/ListboxContents";
import Markdown from "@/component/Markdown";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";
import DivisionSticky from "@/component/DivisionSticky";

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
    <section className="max-w-content mx-auto p-4">
      <div className="gap-12 grid grid-cols-1 md:grid-cols-12 gird-rows-1 w-full">
        <div
          id={IDENTIFIER}
          className="md:col-span-8 lg:col-span-9 overflow-y-auto"
        >
          <div className="flex flex-col gap-4 mb-16">
            <Heading level={1} id={getSlugByTitle(metadata.title)}>
              {metadata.title}
            </Heading>
            <div className="flex flex-wrap gap-1 items-center text-nowrap font-normal text-sm opacity-60">
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

          <article className="w-full overflow-x-hidden">
            <Markdown source={content} />
          </article>
        </div>
        <DivisionSticky className="hidden md:block md:col-span-4 lg:col-span-3 p-1">
          {[
            <Card shadow="sm">
              <ListboxContents anchors={metadata.anchors} />
            </Card>,
            <Card shadow="sm">
              <ListboxArticles date={metadata.date} articles={articles} />
            </Card>,
          ].map((item, index) => (
            <div key={index} className="not-last:mb-4">
              {item}
            </div>
          ))}
        </DivisionSticky>
      </div>
    </section>
  );
}
