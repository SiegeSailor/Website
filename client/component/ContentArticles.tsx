"use server";

import { getArticles } from "@/helper/server/article";
import CardArticle from "@/component/CardArticle";
import CardBlog from "@/component/CardBlog";

export default async function () {
  const articles = await getArticles();

  return (
    <div>
      <div className="flex flex-col gap-2 mb-12">
        <h4 className="text-2xl sm:text-3xl font-light text-default-600 w-full text-left">
          Let's Talk About Tech
        </h4>
        <p className="text-medium text-default-400">
          Here, I share real experiences from my journey in software
          engineering—lessons learned, challenges faced, and thoughts on the
          ever-changing world of technology.
        </p>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          {articles.slice(0, 4).map((article, index) => {
            return <CardArticle key={index} filename={article.filename} />;
          })}
        </div>
        <CardBlog
          articles={articles.slice(4)}
          className="w-full md:w-[calc(50%-1rem)] h-[300px] min-w-[200px] flex-shrink-0"
        />
      </div>
    </div>
  );
}
