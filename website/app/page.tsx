import { type Metadata } from "next";

import { createPageTitle } from "@/helpers/utility";
import { ROUTES } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";
import { getHome, getSite } from "@/helpers/server/content";
import PostList, { type TPost } from "@/components/PostList";

export async function generateMetadata(): Promise<Metadata> {
  const { site, titleOf } = await getSite();
  return { title: createPageTitle(site.title, titleOf(ROUTES.home)) };
}

// The article `description` is markdown prose; flatten it to plain text for the
// list summary so links/images/blockquote markers don't leak as raw syntax.
const toPlainText = (markdown: string) =>
  markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> label
    .replace(/^\s*>\s?/gm, "") // blockquote markers
    .replace(/[`*]/g, "") // inline code / emphasis
    .replace(/\s+/g, " ")
    .trim();

export default async function () {
  const [articles, { profile, company }] = await Promise.all([
    getArticles(),
    getHome(),
  ]);

  const posts: TPost[] = articles.map((article) => ({
    date: article.metadata.date,
    title: article.metadata.title,
    minutes: article.metadata.minutes,
    description: toPlainText(article.metadata.description),
    category: article.metadata.category,
    technologies: article.metadata.technologies,
    route: article.metadata.route,
  }));

  return (
    <section className="py-2">
      <div className="mb-12 mt-2">
        <h1 className="text-2xl sm:text-[1.7rem] font-medium leading-snug tracking-tight text-balance">
          {profile.status.position} at{" "}
          {company?.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline underline-offset-4"
            >
              {company.company}
            </a>
          ) : (
            company?.company
          )}
          {" — "}
          {profile.tagline}
        </h1>
        <p className="mt-3 text-default-500 leading-relaxed">{profile.intro}</p>
      </div>

      <PostList posts={posts} />
    </section>
  );
}
