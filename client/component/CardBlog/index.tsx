import React from "react";
import clsx from "clsx";

import { getArticles } from "@/file";
import Body from "@/component/CardBlog/Body";
import CardBlock from "@/component/CardBlock";

export default async function ({ className }: { className?: string }) {
  const articles = await getArticles();

  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="Let's Talk About Tech"
      isFooterBlurred
      contentBody={<Body articles={articles} />}
    />
  );
}
