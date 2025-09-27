"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { COLUMNS } from ".";
import { PROPS_BUTTON } from "./ContentTop";
import { renderSelection } from "./DropdownMetadata";
import { useBlogStore } from "@/store/blog";

export default function () {
  const columns = useBlogStore((state) => state.columns);
  const setColumns = useBlogStore((state) => state.setColumns);

  return (
    <Dropdown>
      <DropdownTrigger className="hidden sm:flex">
        <Button {...PROPS_BUTTON}>
          <div className="flex justify-between w-full">
            <span>Columns</span>
            <span>
              {renderSelection(
                columns,
                COLUMNS.map((column) => column.key)
              )}
            </span>
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Table Columns"
        closeOnSelect={false}
        disallowEmptySelection
        onSelectionChange={setColumns}
        selectedKeys={columns}
        selectionMode="multiple"
      >
        {COLUMNS.map((column) => (
          <DropdownItem key={column.key}>{column.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
