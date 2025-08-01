"use client";

import { ComponentProps } from "react";
import { Card } from "@heroui/react";
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
        <p className={clsx("text-left", "truncate w-[5.25rem]")}>
          {article.metadata.category}
        </p>
        <h3
          className={clsx(
            "text-left text-medium font-light",
            "truncate w-[calc(100%-10.25rem)]"
          )}
        >
          {article.metadata.title}
        </h3>
        <p className={clsx("opacity-60 text-sm text-right", "w-[5rem]")}>
          {article.metadata.date}
        </p>
      </div>
    </Card>
  );
}
