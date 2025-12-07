"use client";

import { useSearchParams } from "next/navigation";

import { TMetadata } from "@/component/TableArticles/DropdownMetadata";

export function useSearchByMetadata(metadata: TMetadata, value: string) {
  const searchParams = useSearchParams();
  const paramConstructor = new URLSearchParams(searchParams.toString());
  const paramCurrent = paramConstructor.get(metadata);

  const isSelected = paramCurrent && value && paramCurrent.includes(value);
  if (isSelected) {
    const filtered = paramCurrent.split(",").filter((item) => item !== value);
    filtered.length
      ? paramConstructor.set(metadata, filtered.join(","))
      : paramConstructor.delete(metadata);
  } else {
    paramConstructor.set(
      metadata,
      [paramCurrent, value].filter(Boolean).join(",")
    );
  }

  return { href: `/blog?${paramConstructor.toString()}`, isSelected };
}
