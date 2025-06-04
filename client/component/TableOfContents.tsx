"use client";

import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helper/article";

export default function ({
  anchors,
}: Readonly<{ anchors: ReturnType<typeof getAnchorsByContent> }>) {
  return (
    <Listbox
      aria-label="Table of Contents"
      selectionMode="none"
      variant="flat"
      color="primary"
    >
      <ListboxSection title="Table of Contents">
        {anchors.map((anchor) => {
          return (
            <ListboxItem
              key={anchor.identifier}
              href={`#${anchor.identifier}`}
              className={clsx(
                {
                  1: "pl-2",
                  2: "pl-4",
                  3: "pl-8",
                  4: "pl-10",
                  5: "pl-12",
                  6: "pl-14",
                }[anchor.level]
              )}
            >
              {anchor.title}
            </ListboxItem>
          );
        })}
      </ListboxSection>
    </Listbox>
  );
}
