"use client";

import { Chip } from "@heroui/react";
import { ComponentProps } from "react";

import { TArticle } from "@/helper/server/article";
import { useSearchByMetadata } from "@/helper/client/blog";
import Link from "@/component/Link";

export default function ({
  category,
  ...props
}: ComponentProps<typeof Chip> &
  Readonly<{ category: TArticle["metadata"]["category"] }>) {
  const href = useSearchByMetadata("category", category);

  return (
    <Chip size="md" variant="flat" color="default" {...props}>
      <Link href={href} isPlain>
        {category}
      </Link>
    </Chip>
  );
}
