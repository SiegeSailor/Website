"use client";

import { Chip } from "@heroui/react";
import type { ComponentProps } from "react";

import { STATUS_TO_COLOR } from "@/settings/constant";
import { TArticle } from "@/helpers/server/article";
import { useSearchByMetadata } from "@/helpers/client/blog";
import Link from "@/components/Link";

export default function ({
  status,
  ...props
}: ComponentProps<typeof Chip> &
  Readonly<{ status: TArticle["metadata"]["status"] }>) {
  const { href } = useSearchByMetadata("status", status);

  return (
    <Chip size="md" variant="flat" color={STATUS_TO_COLOR[status]} {...props}>
      <Link href={href} isPlain prefetch={false}>
        {status}
      </Link>
    </Chip>
  );
}
