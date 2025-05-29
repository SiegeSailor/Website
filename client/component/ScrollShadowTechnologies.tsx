import { Chip, ScrollShadow } from "@heroui/react";
import { ComponentProps, createElement } from "react";
import clsx from "clsx";

import { TECHNOLOGY_ICON } from "@/setting/icon";

export default function ({
  tags,
  isHideText = false,
  isHideIcon = false,
  propsChip,
  propsScrollShadow,
}: Readonly<{
  tags: string[];
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
      {tags.map((tag) => (
        <Chip
          key={tag}
          variant="flat"
          size="md"
          {...propsChip}
          className={clsx(
            "text-background dark:text-foreground",
            "font-normal text-sm text-left",
            "px-2 py-1",
            propsChip?.className
          )}
          startContent={
            !isHideIcon &&
            tag in TECHNOLOGY_ICON &&
            createElement(TECHNOLOGY_ICON[tag as keyof typeof TECHNOLOGY_ICON])
          }
        >
          {!isHideText && tag}
        </Chip>
      ))}
    </ScrollShadow>
  );
}
