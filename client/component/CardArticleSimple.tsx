"use server";

import { Card } from "@heroui/react";
import { ComponentProps } from "react";

import { getArticleByFilename } from "@/helper/server/article";
import Link from "@/component/Link";

export default async function ({
  filename,
  isMultiple = false,
  ...props
}: ComponentProps<typeof Card> &
  Readonly<{ filename: string; isMultiple?: boolean }>) {
  const article = await getArticleByFilename(filename);

  return (
    <Card isHoverable isPressable shadow="sm" {...props}>
      <Link href={article.metadata.route} isPlain>
        {isMultiple ? (
          <div className="flex flex-wrap gap-1 justify-start p-4">
            <div className="w-full flex flex-nowrap justify-between items-center">
              <p className="text-foreground/50 text-small text-left font-light">
                {article.metadata.category}
              </p>
              <p className="text-foreground/50 text-small text-right font-light">
                {article.metadata.date}
              </p>
            </div>
            <h3 className="text-left text-medium font-normal line-clamp-1">
              {article.metadata.title}
            </h3>
          </div>
        ) : (
          <div className="flex flex-nowrap justify-between items-center whitespace-nowrap p-4">
            <p className="text-foreground/50 text-small text-left font-light truncate w-16">
              {article.metadata.category}
            </p>
            <h3 className="text-left text-medium font-normal truncate w-[calc(100%-10rem)]">
              {article.metadata.title}
            </h3>
            <p className="text-foreground/50 text-small text-right font-light w-20">
              {article.metadata.date}
            </p>
          </div>
        )}
      </Link>
    </Card>
  );
}
