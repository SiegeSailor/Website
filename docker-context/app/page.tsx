import { type Metadata } from "next";

import { createPageTitle } from "@/helpers/utility";
import { ROUTE_TO_TITLE } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";
import { getResume } from "@/helpers/server/resume";
import PostList, { type TPost } from "@/components/PostList";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/"]),
};

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
  const [articles, { profile, experience }] = await Promise.all([
    getArticles(),
    getResume(),
  ]);

  const current = experience[0];
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
          {current?.website ? (
            <a
              href={current.website}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline underline-offset-4"
            >
              {current.company}
            </a>
          ) : (
            current?.company
          )}
          {" — "}DevOps &amp; full-stack, from cloud microservices to
          FDA-regulated medical devices.
        </h1>
        <p className="mt-3 text-default-500 leading-relaxed">
          I build scalable, maintainable systems and write up what I learn along
          the way — CI/CD, containers, embedded WebKit, and the occasional
          debugging saga.
        </p>
      </div>

      <PostList posts={posts} />
    </section>
  );
}
