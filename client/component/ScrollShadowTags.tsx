import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { site } from "@/setting";

export default function ({
  tags,
  className,
  ...props
}: React.ComponentProps<typeof Chip> & {
  tags: string[];
  className?: string;
}) {
  return (
    <ScrollShadow className="flex gap-2 mt-2" orientation="horizontal">
      {tags.map((tag) => (
        <Chip
          key={tag}
          variant="bordered"
          {...props}
          className={clsx(
            "text-background dark:text-foreground",
            "border-default-400 dark:border-default-500",
            "font-medium text-sm text-left",
            "px-2 py-1",
            className
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
