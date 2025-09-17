"use client";

import { Chip } from "@heroui/react";

import { TArticle } from "@/helper/server/article";
import Link from "@/component/Link";

export default function ({
  category,
}: Readonly<{ category: TArticle["metadata"]["category"] }>) {
  return (
    <Chip size="md" variant="flat" color="default">
      <Link href={`/blog?category=${category}`} isPlain>
        {category}
      </Link>
    </Chip>
  );
}
