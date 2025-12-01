"use server";

import { ComponentProps } from "react";
import clsx from "clsx";

import { getArticles } from "@/helper/server/article";
import CardArticleSimple from "@/component/CardArticleSimple";
import CardBlog from "@/component/CardBlog";
import Chart from "./Chart";

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
                isMultiple={false}
                key={index}
                shadow="md"
              />
            );
          })}
        </div>
        <CardBlog className="col-span-12 sm:col-span-6 flex items-center h-[300px] min-w-[200px]" />
      </div>

      <div className="w-full flex flex-col gap-6 max-w-content mx-auto">
        <p className="text-medium text-foreground/50 max-w-compact w-full mx-auto">
          See the articles categorized by publish dates, as illustrated.
        </p>
        <div className="h-[350px] sm:h-[300px]">
          <Chart />
        </div>
      </div>
    </div>
  );
}
