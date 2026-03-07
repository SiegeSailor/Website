"use server";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { getArticles } from "@/helpers/server/article";
import CardArticleSimple from "@/components/CardArticleSimple";
import CardBlog from "@/components/CardBlog";

export default async function ({ ...props }: ComponentProps<"div">) {
  const articles = await getArticles();

  return (
    <div {...props} className={clsx("flex flex-col gap-12", props.className)}>
      <div className="gap-4 grid grid-cols-12 grid-rows-2 sm:grid-rows-1 max-w-compact mx-auto">
        <div className="col-span-12 sm:col-span-6 flex items-end flex-col justify-center gap-4">
          {articles.slice(0, 4).map((article, index) => {
            return (
              <CardArticleSimple
                className="w-full"
                filename={article.filename}
                key={index}
                shadow="md"
              />
            );
          })}
        </div>
        <CardBlog className="col-span-12 sm:col-span-6 flex items-center h-75 min-w-50" />
      </div>
    </div>
  );
}
