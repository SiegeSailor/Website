import clsx from "clsx";

import { getArticles } from "@/helper/article";
import CardArticle from "@/component/CardArticle";
import CardBlog from "@/component/CardBlog";

export default async function ({ title }: Readonly<{ title?: string }>) {
  const articles = await getArticles();

  return (
    <div>
      {title && (
        <h4
          className={clsx(
            "text-3xl sm:text-2xl",
            "font-light text-default-600",
            "w-full mb-6",
            "text-left"
          )}
        >
          {title}
        </h4>
      )}

      <div className="gap-4 grid grid-cols-12 w-full border-collapse">
        {articles.slice(0, 5).map((article, index) => {
          return (
            <CardArticle
              key={index}
              className={clsx(
                "col-span-12 sm:col-span-6 md:col-span-4",
                "h-[300px] w-full"
              )}
              article={article}
            />
          );
        })}
        <CardBlog
          articles={articles.slice(5)}
          className={clsx(
            "col-span-12 sm:col-span-6 md:col-span-4",
            "h-[300px] w-full"
          )}
        />
      </div>
    </div>
  );
}
