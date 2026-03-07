"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@heroui/react";
import { CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";

import { TArticle } from "@/helpers/server/article";
import { useArticleStore, TState as TArticleState } from "@/stores/article";
import { useBlogStore, TState as TBlogState } from "@/stores/blog";

import { PROPS_BUTTON } from "./ContentTop";

export type TMetadata = Extract<
  keyof TArticle["metadata"],
  "category" | "status" | "technologies"
>;

const METADATA_TO_SET_ITEMS: Readonly<
  Record<
    TMetadata,
    Extract<keyof TBlogState, "setCategory" | "setStatus" | "setTechnologies">
  >
> = {
  category: "setCategory",
  status: "setStatus",
  technologies: "setTechnologies",
} as const;

const METADATA_TO_UNIQUES: Readonly<
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

const METADATA_TO_TITLE: Readonly<Record<TMetadata, string>> = {
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
  ...props
}: Omit<ComponentProps<typeof Dropdown>, "children"> &
  Readonly<{
    metadata: TMetadata;
  }>) {
  const columns = useBlogStore((state) => state.columns);
  const items = useBlogStore((state) => state[metadata]);
  const setItems = useBlogStore(
    (state) => state[METADATA_TO_SET_ITEMS[metadata]]
  );
  const uniques = useArticleStore(
    (state) => state[METADATA_TO_UNIQUES[metadata]]
  );

  const searchParam = useSearchParams().get(metadata);

  useEffect(() => {
    setItems(
      searchParam === null || searchParam === "all"
        ? "all"
        : new Set(searchParam.split(","))
    );
  }, [searchParam, setItems]);

  const title = METADATA_TO_TITLE[metadata];

  return (
    <Dropdown
      isDisabled={
        columns !== "all" &&
        !Array.from(columns).find((column) => column === metadata)
      }
      {...props}
    >
      <DropdownTrigger className={clsx("flex", props.className)}>
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
          <DropdownItem
            key={unique}
            selectedIcon={<CheckIcon size="0.75rem" />}
          >
            {unique}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
