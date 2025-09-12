"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@heroui/react";
import { SearchIcon, ChevronDownIcon } from "lucide-react";

import { COLUMNS } from ".";
import { useArticleStore } from "@/store/article";
import { useBlogStore } from "@/store/blog";
import DropdownMetadata from "./DropdownMetadata";

export default function () {
  const lengthArticles = useArticleStore((state) => state.articles.length);
  const columns = useBlogStore((state) => state.columns);
  const filter = useBlogStore((state) => state.filter);
  const resetPage = useBlogStore((state) => state.resetPage);
  const rowsPerPage = useBlogStore((state) => state.rowsPerPage);
  const setColumns = useBlogStore((state) => state.setColumns);
  const setFilter = useBlogStore((state) => state.setFilter);
  const setRowsPerPage = useBlogStore((state) => state.setRowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end flex-wrap">
        <Input
          className="w-full md:w-1/4"
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
        <div className="flex gap-3">
          <DropdownMetadata metadata="category" />
          <DropdownMetadata metadata="status" />
          <DropdownMetadata metadata="technologies" />
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon />} variant="flat">
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={columns}
              selectionMode="multiple"
              onSelectionChange={setColumns}
            >
              {COLUMNS.map((column) => (
                <DropdownItem key={column.key}>{column.label}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-default-400 text-small">
          Total {lengthArticles} articles
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
