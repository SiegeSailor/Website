"use client";

import { Chip } from "@heroui/react";
import type { ComponentProps } from "react";

import { TArticle } from "@/helpers/server/article";
import { useSearchByMetadata } from "@/helpers/client/blog";
import Link from "@/components/Link";

export default function ({
  category,
  ...props
}: ComponentProps<typeof Chip> &
  Readonly<{ category: TArticle["metadata"]["category"] }>) {
  const { href } = useSearchByMetadata("category", category);

  return (
    <Chip size="md" variant="flat" color="default" {...props}>
      <Link href={href} isPlain>
        {category}
      </Link>
    </Chip>
  );
}
