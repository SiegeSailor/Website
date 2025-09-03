"use server";

import { Card } from "@heroui/react";

import { getArticleByFilename } from "@/helper/server/article";
import Link from "@/component/Link";

export default async function ({ filename }: Readonly<{ filename: string }>) {
  const article = await getArticleByFilename(filename);

  return (
    <Card isHoverable isPressable>
      <Link href={article.metadata.route} isPlain>
        <div className="flex flex-nowrap justify-between items-center whitespace-nowrap p-4">
          <p className="text-foreground/50 text-sm text-left truncate w-20">
            {article.metadata.category}
          </p>
          <h3 className="text-left text-medium font-light truncate w-[calc(100%-10rem)]">
            {article.metadata.title}
          </h3>
          <p className="text-foreground/50 text-sm text-right w-20">
            {article.metadata.date}
          </p>
        </div>
      </Link>
    </Card>
  );
}
