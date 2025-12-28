import { Card, Divider } from "@heroui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { globalMetadata } from "@/settings/head";
import { createPageTitle } from "@/helpers/utility";
import { getArticles, getArticleByDate } from "@/helpers/server/article";
import { getSlugByTitle } from "@/helpers/utility";
import ChipCategory from "@/components/ChipCategory";
import ChipStatus from "@/components/ChipStatus";
import DivisionSticky from "@/components/DivisionSticky";
import Heading from "@/components/Heading";
import ListboxArticles from "@/components/ListboxArticles";
import ListboxContents, { IDENTIFIER } from "@/components/ListboxContents";
import Markdown from "@/components/Markdown";
import ScrollShadowTechnologies from "@/components/ScrollShadowTechnologies";

type TParams = Readonly<{ date: string }>;

export async function generateStaticParams(): Promise<TParams[]> {
  const articles = await getArticles();

  return articles.map((article) => ({
    date: article.metadata.date,
  }));
}

export async function generateMetadata({
  params,
}: Readonly<{
  params: Promise<TParams>;
}>): Promise<Metadata> {
  const { date } = await params;
  const article = await getArticleByDate(date);

  const title = createPageTitle(article.metadata.title, "Blog");

  return {
    title,
    description: article.metadata.description,
    openGraph: {
      ...globalMetadata.openGraph,
      title,
      description: article.metadata.description,
    },
    twitter: {
      ...globalMetadata.twitter,
      title,
      description: article.metadata.description,
    },
  };
}

export default async function ({
  params,
}: Readonly<{ params: Promise<TParams> }>) {
  const { date } = await params;

  let article = null;
  try {
    article = await getArticleByDate(date);
  } catch {
    notFound();
  }

  const { metadata, content } = article;

  return (
    <section className="max-w-content mx-auto p-4">
      <div className="gap-12 grid grid-cols-1 md:grid-cols-12 gird-rows-1">
        <div
          id={IDENTIFIER}
          className="md:col-span-8 lg:col-span-9 overflow-y-auto"
        >
          <div className="flex flex-col gap-2 mb-16">
            <Heading level={1} id={getSlugByTitle(metadata.title)}>
              {metadata.title}
            </Heading>
            <div className="flex flex-wrap gap-1 items-center text-nowrap font-normal text-small text-foreground/50">
              <span>{metadata.date} (drafted)</span>
              <span>·</span>
              <span>{metadata.createdOn} (created)</span>
              <span>·</span>
              <span>{metadata.updatedOn} (updated)</span>
              <span>·</span>
              <span>{metadata.minutes} mins read</span>
            </div>
            <div className="flex gap-2 items-center">
              <ChipCategory category={metadata.category} />
              <ChipStatus status={metadata.status} />
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
        <DivisionSticky className="hidden md:block md:col-span-4 lg:col-span-3 p-1">
          {[
            <Card shadow="sm">
              <ListboxContents anchors={metadata.anchors} />
            </Card>,
            <Card shadow="sm">
              <ListboxArticles date={metadata.date} />
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
