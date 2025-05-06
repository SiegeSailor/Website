import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { site } from "@/setting";

export default function ({
  tags,
  propsChip,
  propsScrollShadow,
}: {
  tags: string[];
  propsChip?: React.ComponentProps<typeof Chip>;
  propsScrollShadow?: React.ComponentProps<typeof ScrollShadow>;
}) {
  return (
    <ScrollShadow
      {...propsScrollShadow}
      className={clsx("flex gap-2", propsScrollShadow?.className)}
      orientation="horizontal"
    >
      {tags.map((tag) => (
        <Chip
          key={tag}
          variant="flat"
          {...propsChip}
          className={clsx(
            "text-background dark:text-foreground",
            "font-normal text-sm text-left",
            "px-2 py-1",
            propsChip?.className
          )}
          startContent={
            tag in site.iconMap &&
            React.createElement(site.iconMap[tag as keyof typeof site.iconMap])
          }
        >
          {tag}
        </Chip>
      ))}
    </ScrollShadow>
  );
}
