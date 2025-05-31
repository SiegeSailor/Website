"use client";

import { ComponentProps } from "react";
import { Card, Divider } from "@heroui/react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

import { getArticleByFilename } from "@/helper/article";

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
      className={clsx(props.className)}
      isHoverable
      isPressable
      onPress={() => router.push(`/blog/${article.metadata.date}`)}
    >
      <div className="flex flex-nowrap justify-between items-center whitespace-nowrap p-4">
        <p className="text-left w-[5.25rem] text-ellipsis overflow-hidden">
          {article.metadata.category}
        </p>
        <h3 className="text-left text-medium text-ellipsis overflow-hidden w-1/2">
          {article.metadata.title}
        </h3>
        <p className={clsx("opacity-60 text-sm text-right", "w-1/4")}>
          {article.metadata.date}
        </p>
      </div>
    </Card>
  );
}
