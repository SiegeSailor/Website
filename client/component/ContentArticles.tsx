import clsx from "clsx";

import { getArticles } from "@/helper/article";
import CardArticle from "@/component/CardArticle";
import CardBlog from "@/component/CardBlog";

export default async function () {
  const articles = await getArticles();

  return (
    <div>
      <div className="flex flex-col gap-2 mb-12">
        <h4
          className={clsx(
            "text-3xl sm:text-4xl",
            "font-light text-default-600",
            "w-full",
            "text-left"
          )}
        >
          Let's Talk About Tech
        </h4>
        <p className="text-lg opacity-60">
          Here, I share real experiences from my journey in software
          engineering—lessons learned, challenges faced, and thoughts on the
          ever-changing world of technology.
        </p>
      </div>

      <div className="flex gap-4">
        <div className="gap-4 grid grid-cols-12">
          {articles.slice(0, 4).map((article, index) => {
            return (
              <CardArticle
                key={index}
                className={clsx("col-span-12 sm:col-span-6")}
                article={article}
              />
            );
          })}
        </div>
        <CardBlog
          articles={articles.slice(4)}
          className={clsx(
            "col-span-12 sm:col-span-6 md:col-span-4",
            "h-[300px]"
          )}
        />
      </div>
    </div>
  );
}
