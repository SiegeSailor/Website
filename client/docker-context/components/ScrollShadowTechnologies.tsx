"use client";

import type { ComponentProps } from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { getArticleByFilename } from "@/helpers/server/article";
import { useSearchByMetadata } from "@/helpers/client/blog";
import IconTechnology from "@/components/IconTechnology";
import Link from "@/components/Link";
import ScrollShadowChips from "@/components/ScrollShadowChips";

export default function ({
  isLink = true,
  propsIcon,
  propsContainer,
  propsItem,
  technologies,
}: Omit<ComponentProps<typeof ScrollShadowChips>, "row"> &
  Readonly<{
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

        const chip = (
          <Chip
            key={index}
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
        );

        return isLink ? (
          <Link className="w-auto h-auto" href={href} isPlain key={index}>
            {chip}
          </Link>
        ) : (
          chip
        );
      })}
    </ScrollShadow>
  );
}
