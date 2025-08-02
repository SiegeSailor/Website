import { Chip, ScrollShadow } from "@heroui/react";
import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

export default function ({
  row,
  propsContainer,
  propsItem,
}: Readonly<{
  row: { name: string; icon: ReactNode }[];
  propsContainer?: ComponentProps<typeof ScrollShadow>;
  propsItem?: ComponentProps<typeof Chip>;
}>) {
  return (
    <ScrollShadow
      {...propsContainer}
      className={clsx("flex gap-2", propsContainer?.className)}
      orientation="horizontal"
    >
      {row.map((item) => (
        <Chip
          key={item.name}
          variant="flat"
          size="lg"
          {...propsItem}
          className={clsx(
            "text-background dark:text-foreground",
            "font-normal text-sm text-left",
            "px-2 py-1",
            propsItem?.className
          )}
          startContent={item.icon}
        >
          {item.name}
        </Chip>
      ))}
    </ScrollShadow>
  );
}
