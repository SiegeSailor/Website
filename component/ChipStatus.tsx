"use client";

import { Chip } from "@heroui/react";
import { ComponentProps } from "react";

import { STATUS_TO_COLOR } from "@/setting/site";
import { TArticle } from "@/helper/server/article";
import { useSearchByMetadata } from "@/helper/client/blog";
import Link from "@/component/Link";

export default function ({
  status,
  ...props
}: ComponentProps<typeof Chip> &
  Readonly<{ status: TArticle["metadata"]["status"] }>) {
  const { href } = useSearchByMetadata("status", status);

  return (
    <Chip size="md" variant="flat" color={STATUS_TO_COLOR[status]} {...props}>
      <Link href={href} isPlain>
        {status}
      </Link>
    </Chip>
  );
}
