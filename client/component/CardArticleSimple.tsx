"use server";

import { Card } from "@heroui/react";
import { ComponentProps } from "react";
import clsx from "clsx";

import { getArticleByFilename, TArticle } from "@/helper/server/article";
import Link from "@/component/Link";

const METADATA_TO_CLASSNAMES = {
  category: "text-foreground/50 text-small font-light",
  date: "text-foreground/50 text-small font-light text-right",
  title: "text-medium font-normal",
} as const;

function ChildrenMultiple({ article }: { article: TArticle }) {
  const { category, date, title } = article.metadata;

  return (
    <div className="flex flex-wrap gap-1 justify-start">
      <div className="w-full flex flex-nowrap justify-between items-center">
        <p className={METADATA_TO_CLASSNAMES.category}>{category}</p>
        <p className={METADATA_TO_CLASSNAMES.date}>{date}</p>
      </div>
      <h3 className={clsx(METADATA_TO_CLASSNAMES.title, "line-clamp-1")}>
        {title}
      </h3>
    </div>
  );
}

function ChildrenSingle({ article }: { article: TArticle }) {
  const { category, date, title } = article.metadata;

  return (
    <div className="flex flex-nowrap justify-between items-center whitespace-nowrap">
      <p className={clsx(METADATA_TO_CLASSNAMES.category, "truncate w-16")}>
        {category}
      </p>
      <h3
        className={clsx(
          METADATA_TO_CLASSNAMES.title,
          "truncate w-[calc(100%-10rem)]"
        )}
      >
        {title}
      </h3>
      <p className={clsx(METADATA_TO_CLASSNAMES.date, "w-20")}>{date}</p>
    </div>
  );
}

export default async function ({
  filename,
  isMultiple,
  ...props
}: ComponentProps<typeof Card> &
  Readonly<{ filename: string; isMultiple: boolean }>) {
  const article = await getArticleByFilename(filename);

  return (
    <Card isHoverable isPressable shadow="sm" {...props}>
      <Link className="text-left p-4" href={article.metadata.route} isPlain>
        {isMultiple ? (
          <ChildrenMultiple article={article} />
        ) : (
          <ChildrenSingle article={article} />
        )}
      </Link>
    </Card>
  );
}
