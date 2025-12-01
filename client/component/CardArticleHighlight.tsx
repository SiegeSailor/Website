"use server";

import { ComponentProps } from "react";
import { Card, CardBody, CardHeader, ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { getArticleByDate } from "@/helper/server/article";
import ChipCategory from "@/component/ChipCategory";
import Heading from "@/component/Heading";
import Markdown from "@/component/Markdown";

export default async function ({
  date,
  ...props
}: ComponentProps<typeof Card> & Readonly<{ date: string }>) {
  const article = await getArticleByDate(date);

  return (
    <Card
      {...props}
      className={clsx("relative overflow-hidden", props.className)}
      shadow="sm"
    >
      <CardHeader className="flex flex-col gap-2">
        <div className="flex w-full justify-between items-center flex-wrap gap-2">
          <ChipCategory category={article.metadata.category} />
          <p className="md:w-full lg:w-auto text-small font-light">
            {article.metadata.date}
          </p>
        </div>
        <Heading
          level={6}
          href={article.metadata.route}
          className="w-full mb-0! mt-0! line-clamp-2"
        >
          {article.metadata.title}
        </Heading>
      </CardHeader>

      <CardBody>
        <ScrollShadow size={20}>
          <div className="mb-2">
            <Markdown
              source={article.metadata.description}
              p={{ className: "text-foreground/50" }}
            />
          </div>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
}
