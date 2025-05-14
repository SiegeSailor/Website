import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  ScrollShadow,
} from "@heroui/react";
import clsx from "clsx";

import { getArticleByFilename } from "@/file";
import Link from "@/component/Link";
import Markdown from "@/component/Markdown";
import ScrollShadowChips from "@/component/ScrollShadowChips";

export default function ({
  article,
  ...props
}: React.ComponentProps<typeof Card> & {
  article: Awaited<ReturnType<typeof getArticleByFilename>>;
}) {
  const href = `/blog/${article.metadata.date}`;

  return (
    <Card {...props} className={clsx("p-2", props.className)}>
      <CardHeader>
        <div className="flex flex-col gap-1">
          <p className={clsx("opacity-60", "font-normal text-sm text-left")}>
            {article.metadata.date}
          </p>
          <h3 className="text-xl font-medium">{article.metadata.title}</h3>
        </div>
      </CardHeader>

      <CardBody>
        <ScrollShadow orientation="vertical">
          <Markdown source={article.metadata.description} />
        </ScrollShadow>
      </CardBody>

      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <ScrollShadowChips
            tags={article.metadata.tags}
            propsChip={{ className: "text-foreground" }}
            propsScrollShadow={{ className: "w-full flex-grow" }}
          />
          <div className="text-nowrap">
            <Link href={href} className="font-normal">
              Read More
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
