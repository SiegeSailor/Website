"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { CheckIcon } from "lucide-react";
import type { ComponentProps } from "react";
import clsx from "clsx";

import { useBlogStore } from "@/stores/blog";

import { COLUMNS } from ".";
import { PROPS_BUTTON } from "./ContentTop";
import { renderSelection } from "./DropdownMetadata";

export default function ({
  ...props
}: Omit<ComponentProps<typeof Dropdown>, "children">) {
  const columns = useBlogStore((state) => state.columns);
  const setColumns = useBlogStore((state) => state.setColumns);

  return (
    <Dropdown {...props}>
      <DropdownTrigger className={clsx("flex", props.className)}>
        <Button {...PROPS_BUTTON}>
          <div className="flex justify-between w-full">
            <span className="capitalize truncate max-w-2/3">Columns</span>
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
          <DropdownItem
            key={column.key}
            selectedIcon={<CheckIcon size="0.75rem" />}
          >
            {column.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
