"use client";

import { Chip, ScrollShadow } from "@heroui/react";
import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

export default function ({
  propsContainer,
  propsItem,
  row,
}: Readonly<{
  propsContainer?: ComponentProps<typeof ScrollShadow>;
  propsItem?: ComponentProps<typeof Chip>;
  row: ComponentProps<typeof Chip>[];
}>) {
  return (
    <ScrollShadow
      orientation="horizontal"
      {...propsContainer}
      className={clsx("flex gap-2", propsContainer?.className)}
    >
      {row.map((item, index) => (
        <Chip
          key={index}
          size="lg"
          variant="flat"
          {...propsItem}
          {...item}
          className={clsx(
            "text-background dark:text-foreground font-normal text-sm text-left px-2 py-1",
            propsItem?.className,
            item.className
          )}
        />
      ))}
    </ScrollShadow>
  );
}
