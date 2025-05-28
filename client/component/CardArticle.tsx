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
      <div className="gap-4 flex flex-nowrap justify-between items-center whitespace-nowrap p-4">
        <h3 className="text-lg font-normal text-left text-ellipsis overflow-hidden w-2/3">
          {article.metadata.title}
        </h3>

        <p className={clsx("opacity-60", "font-normal text-sm")}>
          {article.metadata.date}
        </p>
      </div>
    </Card>
  );
}
