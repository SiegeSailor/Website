"use client";

import { Chip } from "@heroui/react";

import { STATUS_COLOR } from "@/setting/site";
import { TArticle } from "@/helper/server/article";
import { useHref } from "@/helper/client/blog";
import Link from "@/component/Link";

export default function ({
  status,
}: Readonly<{ status: TArticle["metadata"]["status"] }>) {
  const href = useHref("status", status);

  return (
    <Chip size="md" variant="flat" color={STATUS_COLOR[status]}>
      <Link href={href} isPlain>
        {status}
      </Link>
    </Chip>
  );
}
