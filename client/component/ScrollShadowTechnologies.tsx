import { Chip, ScrollShadow } from "@heroui/react";
import { ComponentProps, createElement } from "react";
import clsx from "clsx";

import { getArticleByFilename } from "@/helper/article";
import { TECHNOLOGY_ICON } from "@/setting/icon";

export default function ({
  technologies,
  isHideText = false,
  isHideIcon = false,
  propsChip,
  propsScrollShadow,
}: Readonly<{
  technologies: Awaited<
    ReturnType<typeof getArticleByFilename>
  >["metadata"]["technologies"];
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
      {technologies.map((technology) => (
        <Chip
          key={technology}
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
            !isHideIcon && createElement(TECHNOLOGY_ICON[technology])
          }
        >
          {!isHideText && technology}
        </Chip>
      ))}
    </ScrollShadow>
  );
}
