"use server";

import type { ComponentProps } from "react";
import clsx from "clsx";

import { HIGHLIGHTS } from "@/settings/config";
import CardArticleDetail from "@/components/CardArticleDetail";
import ChartLineArticle from "@/components/ChartLineArticle";
import DivisionTitle from "@/components/DivisionTitle";
import Link from "@/components/Link";

export default async function ({ ...props }: ComponentProps<"div">) {
  return (
    <div {...props} className={clsx("flex flex-col gap-12", props.className)}>
      <DivisionTitle
        className="text-right"
        description={
          <>
            A showcase of recent writings and highlights. Dive deeper in my{" "}
            <Link href="/blog">Blog</Link>.
          </>
        }
        title="My Highlighted Articles"
      />

      <div className="gap-4 grid grid-cols-12 grid-rows-1 max-w-compact mx-auto">
        {HIGHLIGHTS.map((date) => (
          <CardArticleDetail
            className="col-span-12 sm:col-span-4 h-75 border-background dark:border-default-100 border-2 bg-default-50 overflow-hidden"
            date={date}
            key={date}
            propsChipCategory={{ variant: "bordered", size: "md" }}
            propsChipStatus={{ variant: "bordered", size: "md" }}
            propsHeading={{ level: 6 }}
            shadow="md"
          />
        ))}
      </div>

      <div className="w-full flex flex-col gap-6 max-w-content mx-auto">
        <p className="text-medium text-foreground/50 max-w-compact w-full mx-auto">
          See the articles categorized by publish dates, as illustrated.
        </p>
        <div className="block sm:hidden h-75">
          <ChartLineArticle xRotation={90} />
        </div>
        <div className="hidden sm:block h-75">
          <ChartLineArticle xRotation={0} />
        </div>
      </div>
    </div>
  );
}
