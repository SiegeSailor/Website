import React from "react";
import * as next from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper";
import { getArticles } from "@/file";
import { site } from "@/setting";
import InfiniteScroll from "@/component/InfiniteScroll";
import CardArticle from "@/component/CardArticle";

export const metadata: next.Metadata = {
  title: generateTitle(site.pathMap["/blog"]),
};

export default async function () {
  const articles = await getArticles();

  return (
    <section>
      <InfiniteScroll
        items={articles.map((article, index) => {
          const isFullRow = index % 3 === 0;
          return (
            <CardArticle
              key={index}
              className={clsx(isFullRow && "col-span-full")}
              article={article}
            />
          );
        })}
      />
    </section>
  );
}
