"use client";

import { ComponentProps } from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { getArticleByFilename } from "@/helper/server/article";
import { useSearchByMetadata } from "@/helper/client/blog";
import IconTechnology from "@/component/IconTechnology";
import Link from "@/component/Link";
import ScrollShadowChips from "@/component/ScrollShadowChips";

export default function ({
  isLink = true,
  propsIcon,
  propsContainer,
  propsItem,
  technologies,
  ...props
}: Omit<ComponentProps<typeof ScrollShadowChips>, "row"> &
  Readonly<{
    propsContainer?: ComponentProps<typeof ScrollShadow>;
    propsItem?: ComponentProps<typeof Chip>;
    isLink?: boolean;
    propsIcon?: Omit<ComponentProps<typeof IconTechnology>, "technology">;
    technologies: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"];
  }>) {
  return (
    <ScrollShadow
      orientation="horizontal"
      {...propsContainer}
      className={clsx("flex gap-2", propsContainer?.className)}
    >
      {technologies.map((technology, index) => {
        const { href, isSelected } = useSearchByMetadata(
          "technologies",
          technology
        );

        return (
          <Link className="w-auto h-auto" href={href} isPlain key={index}>
            <Chip
              size="lg"
              startContent={
                <IconTechnology {...propsIcon} technology={technology} />
              }
              classNames={{ base: isSelected ? "bg-default-100" : null }}
              {...propsItem}
              className={clsx(
                "text-background dark:text-foreground font-normal text-small text-left px-2 py-1",
                propsItem?.className
              )}
              variant={isSelected ? "solid" : propsItem?.variant ?? "flat"}
            >
              {technology}
            </Chip>
          </Link>
        );
      })}
    </ScrollShadow>
  );
}
