"use client";

import { Chip } from "@heroui/react";

import { STATUS_COLOR } from "@/setting/site";
import { TArticle } from "@/helper/server/article";
import Link from "@/component/Link";

export default function ({
  status,
}: Readonly<{ status: TArticle["metadata"]["status"] }>) {
  return (
    <Chip size="md" variant="flat" color={STATUS_COLOR[status]}>
      <Link href={`/blog?status=${status}`} isPlain>
        {status}
      </Link>
    </Chip>
  );
}
