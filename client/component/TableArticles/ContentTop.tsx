"use client";

import { Button, Input } from "@heroui/react";
import { ChevronDownIcon, SearchIcon } from "lucide-react";
import { ComponentProps } from "react";

import { useArticleStore } from "@/store/article";
import { useBlogStore } from "@/store/blog";
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
  const rowsPerPage = useBlogStore((state) => state.rowsPerPage);
  const setFilter = useBlogStore((state) => state.setFilter);
  const setRowsPerPage = useBlogStore((state) => state.setRowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-2 lg:gap-24 items-end flex-wrap md:flex-nowrap">
        <Input
          className="w-full md:w-auto lg:w-full"
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
        <div className="flex gap-2 flex-wrap md:flex-nowrap">
          <DropdownMetadata metadata="category" />
          <DropdownMetadata metadata="status" />
          <DropdownMetadata metadata="technologies" />
          <DropdownColumns />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          {lengthMatched} of {lengthArticles} matched
        </span>
        <label className="flex items-center text-default-400 text-small">
          Rows per page:
          <select
            className="bg-transparent text-default-400 text-small"
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              resetPage();
            }}
            value={rowsPerPage}
          >
            {[10, 20, 30].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
