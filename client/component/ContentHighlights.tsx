"use server";

import { ComponentProps } from "react";
import clsx from "clsx";

import { HIGHLIGHTS } from "@/setting/home";
import CardArticleDetail from "@/component/CardArticleDetail";
import ChartLineArticle from "@/component/ChartLineArticle";
import Link from "@/component/Link";

export default async function ({ ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={clsx("flex flex-col gap-12", props.className)}>
      <div className="w-full flex flex-col gap-2 max-w-compact mx-auto text-right">
        <h4 className="text-2xl sm:text-3xl font-light text-default-600 w-full">
          My Highlighted Articles
        </h4>
        <p className="w-full text-medium text-foreground/50">
          A showcase of recent writings and highlights. Dive deeper in my{" "}
          <Link href="/blog">Blog</Link>.
        </p>
      </div>
      <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full max-w-compact mx-auto">
        {HIGHLIGHTS.map((date) => (
          <CardArticleDetail
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] border-background dark:border-default-100 border-2 bg-default-50 overflow-hidden"
            date={date}
            propsChipCategory={{ variant: "bordered", size: "md" }}
            propsChipStatus={{ variant: "bordered", size: "md" }}
            propsHeading={{ level: 6 }}
            key={date}
          />
        ))}
      </div>
      <div className="w-full flex flex-col gap-6 max-w-content mx-auto">
        <p className="text-medium text-foreground/50 max-w-compact w-full mx-auto">
          See the articles categorized by publish dates, as illustrated.
        </p>
        <div className="block sm:hidden h-[300px]">
          <ChartLineArticle xRotation={90} />
        </div>
        <div className="hidden sm:block h-[300px]">
          <ChartLineArticle xRotation={0} />
        </div>
      </div>
    </div>
  );
}
