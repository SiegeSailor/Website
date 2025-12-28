"use client";

import {
  Button,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { useArticleStore } from "@/stores/article";
import { useBlogStore } from "@/stores/blog";
import { ROWS_PER_PAGE } from "@/settings/constant";
import Link from "@/components/Link";

import DropdownColumns from "./DropdownColumns";
import DropdownMetadata from "./DropdownMetadata";

export const PROPS_BUTTON: ComponentProps<typeof Button> = {
  className:
    "w-[calc(50%-0.25rem)] md:w-28 lg:w-36 xl:w-48 flex justify-between",
  endContent: <ChevronDownIcon size="1.25rem" />,
  variant: "flat",
};

export default function () {
  const lengthArticles = useArticleStore((state) => state.articles.length);
  const lengthMatched = useBlogStore((state) => state.lengthMatched);
  const filter = useBlogStore((state) => state.filter);
  const resetPage = useBlogStore((state) => state.resetPage);
  const resetSearch = useBlogStore((state) => state.resetSearch);
  const rowsPerPage = useBlogStore((state) => state.rowsPerPage);
  const setFilter = useBlogStore((state) => state.setFilter);
  const setRowsPerPage = useBlogStore((state) => state.setRowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-start flex-wrap">
        <Input
          className="w-full"
          isClearable
          placeholder="Search by Title"
          onClear={() => {
            setFilter("");
            resetPage();
          }}
          onValueChange={(value) => {
            setFilter(value);
            if (value) resetPage();
          }}
          startContent={
            <SearchIcon className="text-default-400 shrink-0" size="1.45rem" />
          }
          value={filter}
        />
        <div className="w-full flex gap-2 flex-nowrap">
          <DropdownMetadata className="grow" metadata="category" />
          <DropdownMetadata className="grow" metadata="status" />
          <DropdownMetadata className="grow" metadata="technologies" />
          <DropdownColumns className="grow" />
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 flex-wrap">
        <span className="text-default-400 text-small flex flex-row items-center flex-nowrap gap-2">
          {lengthMatched === lengthArticles ? (
            <>{lengthArticles} articles in total</>
          ) : (
            <>
              {lengthMatched} of {lengthArticles} matched
              <Link href="/blog" onClick={resetSearch} size="sm">
                Clear
              </Link>
            </>
          )}
        </span>
        <Popover showArrow placement="bottom-start">
          <PopoverTrigger>
            <div className="text-default-400 text-small cursor-pointer flex flex-row items-center flex-nowrap gap-2">
              Rows per page: {rowsPerPage} <ChevronDownIcon size="1rem" />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              {ROWS_PER_PAGE.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant="light"
                  onPress={() => {
                    setRowsPerPage(value);
                    resetPage();
                  }}
                >
                  {value}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
