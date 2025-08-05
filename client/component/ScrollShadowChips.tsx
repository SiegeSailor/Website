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
  row: { name: string; icon: ReactNode }[];
}>) {
  return (
    <ScrollShadow
      orientation="horizontal"
      {...propsContainer}
      className={clsx("flex gap-2", propsContainer?.className)}
    >
      {row.map((item) => (
        <Chip
          key={item.name}
          size="lg"
          startContent={item.icon}
          variant="flat"
          {...propsItem}
          className={clsx(
            "text-background dark:text-foreground",
            "font-normal text-sm text-left",
            "px-2 py-1",
            propsItem?.className
          )}
        >
          {item.name}
        </Chip>
      ))}
    </ScrollShadow>
  );
}
