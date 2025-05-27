import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getArticles } from "@/helper/article";
import { ROUTE_TITLE } from "@/setting/site";
import CardBlog from "@/component/CardBlog";
import CardExperience from "@/component/CardExperience";
import CardProject from "@/component/CardProject";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentHero from "@/component/ContentHero";
import CardArticle from "@/component/CardArticle";

export const metadata: Metadata = {
  title: generateTitle(ROUTE_TITLE["/"]),
};

export default async function () {
  const articles = await getArticles();

  return (
    <section className="flex flex-col items-center justify-center gap-12 p-4">
      <ContentHero />

      <div className="gap-4 grid grid-cols-12 grid-rows-2 w-full">
        <CardSummary className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardExperience className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardBlog className="col-span-12 sm:col-span-6 md:col-span-5 h-[300px] w-full" />
        <CardProject className="col-span-12 md:col-span-7 h-[300px] w-full" />
      </div>

      <div>
        <h4
          className={clsx(
            "text-3xl sm:text-2xl",
            "font-light text-default-600",
            "w-full mb-6",
            "text-left"
          )}
        >
          Latest Articles
        </h4>
        <div className="gap-4 grid grid-cols-12 auto-rows-[minmax(200px, auto)] w-full">
          {articles.slice(0, 5).map((article, index) => {
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
        </div>
      </div>
    </section>
  );
}
