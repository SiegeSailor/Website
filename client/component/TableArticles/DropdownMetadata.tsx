import { ComponentProps } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from "@heroui/react";
import { ChevronDownIcon } from "lucide-react";

import { getArticles } from "@/helper/server/article";

export default function ({
  items,
  setItems,
  columns,
  metadata,
  uniques,
}: Readonly<{
  items: ComponentProps<typeof DropdownMenu>["selectedKeys"];
  setItems: ComponentProps<typeof DropdownMenu>["onSelectionChange"];
  columns: Selection;
  metadata: keyof Awaited<ReturnType<typeof getArticles>>[number]["metadata"];
  uniques: { key: string; label: string }[];
}>) {
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
          <DropdownItem key={unique.key}>{unique.label}</DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
