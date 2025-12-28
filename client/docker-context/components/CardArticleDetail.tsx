"use server";

import type { ComponentProps } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
} from "@heroui/react";
import clsx from "clsx";

import { getArticleByDate } from "@/helpers/server/article";
import Markdown from "@/components/Markdown";
import ChipCategory from "@/components/ChipCategory";
import ChipStatus from "@/components/ChipStatus";
import ScrollShadowTechnologies from "@/components/ScrollShadowTechnologies";
import Heading from "@/components/Heading";

export default async function ({
  date,
  propsChipCategory,
  propsChipStatus,
  propsHeading,
  ...props
}: ComponentProps<typeof Card> &
  Readonly<{
    date: string;
    propsChipCategory?: Partial<ComponentProps<typeof ChipCategory>>;
    propsChipStatus?: Partial<ComponentProps<typeof ChipStatus>>;
    propsHeading?: Partial<ComponentProps<typeof Heading>>;
  }>) {
  const article = await getArticleByDate(date);

  return (
    <Card
      shadow="sm"
      {...props}
      className={clsx(
        "relative overflow-hidden border-default-50 border-2",
        props.className
      )}
    >
      <CardHeader className="flex flex-col gap-2 justify-center items-center">
        <div className="w-full flex gap-1 justify-start items-center">
          <span className="text-left text-small font-light">
            {article.metadata.date}
          </span>
          <span>·</span>
          <span className="text-right text-small font-light">
            {article.metadata.minutes} mins read
          </span>
        </div>
        <Heading
          level={6}
          href={article.metadata.route}
          className="w-full mb-0! mt-0! line-clamp-2"
          {...propsHeading}
        >
          {article.metadata.title}
        </Heading>
        <div className="w-full flex gap-2 justify-start items-center">
          <ChipCategory
            category={article.metadata.category}
            {...propsChipCategory}
          />
          <ChipStatus status={article.metadata.status} {...propsChipStatus} />
        </div>
      </CardHeader>

      <CardBody className="h-3/7">
        <ScrollShadow>
          <Markdown
            source={article.metadata.description}
            p={{ className: "text-foreground/50" }}
          />
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
