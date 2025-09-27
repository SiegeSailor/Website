"use client";

import { useSearchParams } from "next/navigation";

import { TMetadata } from "@/component/TableArticles/DropdownMetadata";

export function useHref(metadata: TMetadata, value: string) {
  const searchParam = useSearchParams().get(metadata);
  const isSelected = searchParam === value;

  return `/blog?${metadata}=${isSelected ? "all" : value}`;
}
