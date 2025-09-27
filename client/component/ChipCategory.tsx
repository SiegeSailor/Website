"use client";

import { Chip } from "@heroui/react";

import { TArticle } from "@/helper/server/article";
import { useHref } from "@/helper/client/blog";
import Link from "@/component/Link";

export default function ({
  category,
}: Readonly<{ category: TArticle["metadata"]["category"] }>) {
  const href = useHref("category", category);

  return (
    <Chip size="md" variant="flat" color="default">
      <Link href={href} isPlain>
        {category}
      </Link>
    </Chip>
  );
}
