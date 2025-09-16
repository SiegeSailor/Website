"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { TArticle } from "@/helper/server/article";
import { useArticleStore, TState as TArticleState } from "@/store/article";
import { useBlogStore, TState as TBlogState } from "@/store/blog";

const METADATA_SET_ITEMS: Readonly<
  Record<
    Extract<keyof TArticle["metadata"], "category" | "status" | "technologies">,
    Extract<keyof TBlogState, "setCategory" | "setStatus" | "setTechnologies">
  >
> = {
  category: "setCategory",
  status: "setStatus",
  technologies: "setTechnologies",
} as const;

const METADATA_UNIQUES: Readonly<
  Record<
    keyof typeof METADATA_SET_ITEMS,
    Extract<
      keyof TArticleState,
      "uniqueCategories" | "uniqueStatuses" | "uniqueTechnologies"
    >
  >
> = {
  category: "uniqueCategories",
  status: "uniqueStatuses",
  technologies: "uniqueTechnologies",
} as const;

export default function ({
  metadata,
}: Readonly<{
  metadata: keyof typeof METADATA_SET_ITEMS;
}>) {
  const columns = useBlogStore((state) => state.columns);
  const items = useBlogStore((state) => state[metadata]);
  const setItems = useBlogStore((state) => state[METADATA_SET_ITEMS[metadata]]);
  const uniques = useArticleStore((state) => state[METADATA_UNIQUES[metadata]]);

  const searchParam = useSearchParams().get(metadata);

  useEffect(() => {
    if (searchParam) setItems(new Set([searchParam]));
  }, [searchParam, setItems]);

  return (
    <Dropdown
      isDisabled={
        columns !== "all" &&
        !Array.from(columns).find((column) => column === metadata)
      }
    >
      <DropdownTrigger className="hidden sm:flex">
        <Button endContent={<ChevronDownIcon />} variant="flat">
          <span className="capitalize">{metadata}</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        disallowEmptySelection
        aria-label={`${metadata} Dropdown`}
        closeOnSelect={false}
        selectedKeys={items}
        selectionMode="multiple"
        onSelectionChange={setItems}
      >
        {uniques.map((unique) => (
          <DropdownItem key={unique}>{unique}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
