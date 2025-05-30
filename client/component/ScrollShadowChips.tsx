import { Chip, ScrollShadow } from "@heroui/react";
import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

export default function ({
  row,
  isHideText = false,
  isHideIcon = false,
  propsChip,
  propsScrollShadow,
}: Readonly<{
  row: { name: string; icon: ReactNode }[];
  isHideText?: boolean;
  isHideIcon?: boolean;
  propsChip?: ComponentProps<typeof Chip>;
  propsScrollShadow?: ComponentProps<typeof ScrollShadow>;
}>) {
  return (
    <ScrollShadow
      {...propsScrollShadow}
      className={clsx("flex gap-2 w-11/12", propsScrollShadow?.className)}
      orientation="horizontal"
      size={120}
    >
      {row.map((item) => (
        <Chip
          key={item.name}
          variant="flat"
          size="md"
          {...propsChip}
          className={clsx(
            "text-background dark:text-foreground",
            "font-normal text-sm text-left",
            "px-2 py-1",
            propsChip?.className
          )}
          startContent={!isHideIcon && item.icon}
        >
          {!isHideText && item.name}
        </Chip>
      ))}
    </ScrollShadow>
  );
}
