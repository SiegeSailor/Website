"use client";

import { ComponentProps } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { getArticleByFilename } from "@/helper/article";
import ScrollShadowChips from "@/component/ScrollShadowChips";

export default function ({
  article,
  ...props
}: ComponentProps<typeof Card> &
  Readonly<{
    article: Awaited<ReturnType<typeof getArticleByFilename>>;
  }>) {
  const router = useRouter();

  return (
    <Card
      {...props}
      className={clsx("p-2", props.className)}
      isHoverable
      isPressable
      onPress={() => router.push(`/blog/${article.metadata.date}`)}
    >
      <CardHeader>
        <p className={clsx("opacity-60", "font-normal text-sm text-left")}>
          {article.metadata.date}
        </p>
      </CardHeader>

      <CardBody className="flex justify-center items-center gap-2">
        <h3 className="text-2xl font-light text-center">
          {article.metadata.title}
        </h3>
        <p className={clsx("text-nowrap font-normal text-sm", "opacity-60")}>
          {article.metadata.minutes} Minutes Read
        </p>
      </CardBody>

      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <ScrollShadowChips
            tags={article.metadata.tags}
            propsChip={{ className: "text-foreground", variant: "bordered" }}
            propsScrollShadow={{ className: "w-full flex-grow" }}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
