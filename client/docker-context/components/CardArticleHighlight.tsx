"use server";

import { ComponentProps } from "react";
import { Card } from "@heroui/react";
import clsx from "clsx";

import { getArticleByDate } from "@/helpers/server/article";
import Link from "@/components/Link";

const METADATA_TO_CLASSNAMES = {
  category: "text-foreground/50 text-small font-light",
  date: "text-foreground/50 text-small font-light text-right",
  minutes: "text-foreground/50 text-small font-light",
  title: "text-medium font-medium",
} as const;

export default async function ({
  date,
  ...props
}: ComponentProps<typeof Card> & Readonly<{ date: string }>) {
  const article = await getArticleByDate(date);

  return (
    <Card isHoverable isPressable shadow="sm" {...props}>
      <Link className="text-left p-4" href={article.metadata.route} isPlain>
        <div className="flex flex-wrap gap-1 justify-start">
          <div className="w-full flex flex-nowrap justify-between items-center">
            <p className={METADATA_TO_CLASSNAMES.category}>
              {article.metadata.category}
            </p>
            <p className={METADATA_TO_CLASSNAMES.date}>
              {article.metadata.date}
            </p>
          </div>
          <h3 className={clsx(METADATA_TO_CLASSNAMES.title, "line-clamp-2")}>
            {article.metadata.title}
          </h3>
          <p className={METADATA_TO_CLASSNAMES.minutes}>
            {article.metadata.minutes} mins read
          </p>
        </div>
      </Link>
    </Card>
  );
}
