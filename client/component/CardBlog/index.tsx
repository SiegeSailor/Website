"use server";

import { ComponentProps } from "react";

import { getArticles } from "@/helper/server/article";
import CardBlock from "@/component/CardBlock";
import ContentBody from "@/component/CardBlog/ContentBody";

export default async function ({
  articles,
  ...props
}: Omit<ComponentProps<typeof CardBlock>, "href" | "title"> &
  Readonly<{
    className?: string;
    articles: Awaited<ReturnType<typeof getArticles>>;
  }>) {
  return (
    <CardBlock
      contentBody={<ContentBody articles={articles} />}
      href="/blog"
      title="More Insights on My Blog"
      {...props}
    />
  );
}
