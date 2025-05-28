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
        <p className="text-lg text-default-400">
          Here, I share real experiences from my journey in software
          engineering—lessons learned, challenges faced, and thoughts on the
          ever-changing world of technology.
        </p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
        <div className="md:basis-1/2 flex flex-col gap-2 w-full">
          {articles.slice(0, 4).map((article, index) => {
            return (
              <CardArticle
                key={index}
                className={clsx("w-full")}
                article={article}
              />
            );
          })}
        </div>
        <CardBlog
          articles={articles.slice(4)}
          className={clsx("md:basis-1/2 h-[300px]")}
        />
      </div>
    </div>
  );
}
