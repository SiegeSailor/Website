"use client";

import { ComponentProps } from "react";

import { getArticleByFilename } from "@/helper/server/article";
import IconTechnology from "@/component/IconTechnology";
import Link from "@/component/Link";
import ScrollShadowChips from "@/component/ScrollShadowChips";
// 1. status chip redirection
// 2. technology chip redirection
export default function ({
  isLink = true,
  propsIcon,
  technologies,
  ...props
}: Omit<ComponentProps<typeof ScrollShadowChips>, "row"> &
  Readonly<{
    isLink?: boolean;
    propsIcon?: Omit<ComponentProps<typeof IconTechnology>, "technology">;
    technologies: Awaited<
      ReturnType<typeof getArticleByFilename>
    >["metadata"]["technologies"];
  }>) {
  return (
    <ScrollShadowChips
      {...props}
      row={technologies.map((technology) => ({
        icon: (
          <IconTechnology
            key={technology}
            {...propsIcon}
            technology={technology}
          />
        ),
        name: isLink ? (
          <Link href={`/blog?technologies=${technology}`} isPlain>
            {technology}
          </Link>
        ) : (
          technology
        ),
      }))}
    />
  );
}
