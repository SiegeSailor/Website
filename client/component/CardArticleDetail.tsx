"use server";

import { ComponentProps } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
} from "@heroui/react";
import clsx from "clsx";

import { getArticleByDate } from "@/helper/server/article";
import Markdown from "@/component/Markdown";
import ChipCategory from "@/component/ChipCategory";
import ChipStatus from "@/component/ChipStatus";
import ScrollShadowTechnologies from "@/component/ScrollShadowTechnologies";
import Heading from "@/component/Heading";

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
      <CardHeader className="flex flex-col gap-4">
        <Heading
          level={5}
          href={article.metadata.route}
          className="w-full mb-0! mt-0! line-clamp-2"
        >
          {article.metadata.title}
        </Heading>
        <div className="w-full flex flex-wrap gap-2 justify-between items-center">
          <div className="flex gap-2 items-center">
            <ChipCategory category={article.metadata.category} />
            <ChipStatus status={article.metadata.status} />
          </div>
          <p className="w-full sm:w-auto text-small font-light">
            {article.metadata.date}
          </p>
        </div>
      </CardHeader>

      <CardBody className="h-3/7">
        <ScrollShadow size={20}>
          <Markdown source={article.metadata.description} />
        </ScrollShadow>
      </CardBody>

      <CardFooter>
        <ScrollShadowTechnologies
          technologies={article.metadata.technologies}
          propsItem={{
            className: "text-foreground",
            variant: "bordered",
            size: "md",
          }}
          propsIcon={{ color: "default" }}
        />
      </CardFooter>
    </Card>
  );
}
