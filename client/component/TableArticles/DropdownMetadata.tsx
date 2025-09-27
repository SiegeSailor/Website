"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@heroui/react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { PROPS_BUTTON } from "./ContentTop";
import { TArticle } from "@/helper/server/article";
import { useArticleStore, TState as TArticleState } from "@/store/article";
import { useBlogStore, TState as TBlogState } from "@/store/blog";

export type TMetadata = Extract<
  keyof TArticle["metadata"],
  "category" | "status" | "technologies"
>;

const METADATA_SET_ITEMS: Readonly<
  Record<
    TMetadata,
    Extract<keyof TBlogState, "setCategory" | "setStatus" | "setTechnologies">
  >
> = {
  category: "setCategory",
  status: "setStatus",
  technologies: "setTechnologies",
} as const;

const METADATA_UNIQUES: Readonly<
  Record<
    TMetadata,
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

const METADATA_TITLE: Readonly<Record<TMetadata, string>> = {
  category: "Categories",
  status: "Statuses",
  technologies: "Technologies",
} as const;

export function renderSelection(items: Selection, uniques: string[]) {
  const isAllSelected = items === "all" || items.size === uniques.length;
  return `(${isAllSelected ? "All" : items.size})`;
}

export default function ({
  metadata,
}: Readonly<{
  metadata: TMetadata;
}>) {
  const columns = useBlogStore((state) => state.columns);
  const items = useBlogStore((state) => state[metadata]);
  const setItems = useBlogStore((state) => state[METADATA_SET_ITEMS[metadata]]);
  const uniques = useArticleStore((state) => state[METADATA_UNIQUES[metadata]]);

  const searchParam = useSearchParams().get(metadata);

  useEffect(() => {
    if (searchParam)
      setItems(searchParam === "all" ? "all" : new Set([searchParam]));
  }, [searchParam, setItems]);

  const title = METADATA_TITLE[metadata];

  return (
    <Dropdown
      isDisabled={
        columns !== "all" &&
        !Array.from(columns).find((column) => column === metadata)
      }
    >
      <DropdownTrigger className="hidden sm:flex">
        <Button {...PROPS_BUTTON}>
          <div className="flex justify-between w-full">
            <span className="capitalize truncate max-w-2/3">{title}</span>
            <span>{renderSelection(items, uniques)}</span>
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={`Table ${title}`}
        closeOnSelect={false}
        disallowEmptySelection
        onSelectionChange={setItems}
        selectedKeys={items}
        selectionMode="multiple"
      >
        {uniques.map((unique) => (
          <DropdownItem key={unique}>{unique}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
