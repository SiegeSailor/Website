import { type Metadata } from "next";
import { notFound } from "next/navigation";
import NextLink from "next/link";

import { createPageTitle, getSlugByTitle } from "@/helpers/utility";
import { getArticles, getArticleByDate } from "@/helpers/server/article";
import { createGlobalMetadata } from "@/settings/heads";
import { getSite } from "@/helpers/server/content";
import Heading from "@/components/Heading";
import Markdown from "@/components/Markdown";

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
  const [article, { site }] = await Promise.all([
    getArticleByDate(date),
    getSite(),
  ]);
  const globalMetadata = createGlobalMetadata(site);

  const title = createPageTitle(site.title, article.metadata.title);
  const titleSocial = title.length >= 60 ? title.slice(0, 57) + "..." : title;

  const description = article.metadata.description;

  return {
    title,
    description,
    openGraph: {
      ...globalMetadata.openGraph,
      title: titleSocial,
      description,
      url: `https://${site.domain}${article.metadata.route}`,
    },
    twitter: {
      ...globalMetadata.twitter,
      title: titleSocial,
      description:
        description.length >= 199
          ? description.slice(0, 196) + "..."
          : description,
    },
  };
}

export default async function ({
  params,
}: Readonly<{ params: Promise<TParams> }>) {
  const { date } = await params;

  const articles = await getArticles();
  const index = articles.findIndex((item) => item.metadata.date === date);
  if (index === -1) notFound();

  const article = articles[index];
  const { metadata, content } = article;
  const newer = articles[index - 1];
  const older = articles[index + 1];

  return (
    <article className="py-2">
      <NextLink
        href="/"
        className="font-mono text-tiny text-default-500 hover:text-foreground transition-colors"
      >
        ← Posts
      </NextLink>

      <Heading level={1} id={getSlugByTitle(metadata.title)}>
        {metadata.title}
      </Heading>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-tiny text-default-500">
        <span>{metadata.date}</span>
        <span className="text-default-300">·</span>
        <span>{metadata.minutes} min read</span>
        <span className="text-default-300">·</span>
        <span className="uppercase tracking-wider">{metadata.category}</span>
      </div>

      <div className="mt-6 pt-6 border-t border-default-200">
        <div className="text-default-600">
          <Markdown source={metadata.description} />
        </div>
        <Markdown source={content} />
      </div>

      {(newer || older) && (
        <nav className="mt-14 pt-6 border-t border-default-200 flex justify-between gap-6">
          {older ? (
            <NextLink href={older.metadata.route} className="group max-w-[47%]">
              <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-default-500 mb-1">
                Older
              </span>
              <span className="text-small underline-offset-4 decoration-1 group-hover:underline">
                {older.metadata.title}
              </span>
            </NextLink>
          ) : (
            <span />
          )}
          {newer && (
            <NextLink
              href={newer.metadata.route}
              className="group max-w-[47%] text-right ml-auto"
            >
              <span className="block font-mono text-[0.65rem] uppercase tracking-wider text-default-500 mb-1">
                Newer
              </span>
              <span className="text-small underline-offset-4 decoration-1 group-hover:underline">
                {newer.metadata.title}
              </span>
            </NextLink>
          )}
        </nav>
      )}
    </article>
  );
}
