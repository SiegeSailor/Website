import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper";
import { getArticles } from "@/file";
import { ROUTE_TITLE } from "@/setting/site";
import CardArticle from "@/component/CardArticle";
import InfiniteScroll from "@/component/InfiniteScroll";

export const metadata: Metadata = {
  title: generateTitle(ROUTE_TITLE["/blog"]),
};

export default async function () {
  const articles = await getArticles();

  return (
    <section>
      <InfiniteScroll
        orientation="vertical"
        className="gap-4 grid grid-cols-12 auto-rows-[minmax(200px, auto)] w-full p-4"
        items={articles.map((article, index) => {
          const isFullRow = index % 4 === 0;
          return (
            <CardArticle
              key={index}
              className={clsx(
                "col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full",
                isFullRow && "md:col-span-full md:h-[225px]"
              )}
              article={article}
            />
          );
        })}
      />
    </section>
  );
}
