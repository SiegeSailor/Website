import { Card, ScrollShadow } from "@heroui/react";
import type { ComponentProps } from "react";

import { getArticleByFilename } from "@/helpers/server/article";
import Link from "@/components/Link";

export default async function ({
  filename,
  ...props
}: ComponentProps<typeof Card> & Readonly<{ filename: string }>) {
  const article = await getArticleByFilename(filename);

  const { category, date, title } = article.metadata;

  return (
    <Card isHoverable isPressable shadow="sm" {...props}>
      <Link className="text-left p-4" href={article.metadata.route} isPlain>
        <div className="flex flex-nowrap justify-between items-center whitespace-nowrap">
          <p className="text-foreground/50 text-small font-light truncate w-16">
            {category}
          </p>
          <h3 className="text-medium font-medium w-[calc(100%-10rem)]">
            <ScrollShadow className="w-full" size={20} orientation="horizontal">
              {title}
            </ScrollShadow>
          </h3>
          <p className="text-foreground/50 text-small font-light text-right w-20">
            {date}
          </p>
        </div>
      </Link>
    </Card>
  );
}
