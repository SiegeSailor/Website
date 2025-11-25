"use server";

import { ComponentProps } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
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
      <CardHeader>
        <Heading level={6} href={article.metadata.route}>
          {article.metadata.title}
        </Heading>
      </CardHeader>

      <CardBody className="overflow-hidden flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <ChipCategory category={article.metadata.category} />
          <ChipStatus status={article.metadata.status} />
        </div>

        <ScrollShadow>
          <div className="mb-2">
            <Markdown source={article.metadata.description} />
          </div>
        </ScrollShadow>

        <div className="flex gap-2 items-center">
          <ScrollShadowTechnologies
            technologies={article.metadata.technologies}
            propsItem={{
              className: "text-foreground",
              variant: "bordered",
              size: "md",
            }}
            propsIcon={{ color: "default" }}
          />
        </div>
      </CardBody>
    </Card>
  );
}
