"use client";

import { ComponentProps, ReactNode } from "react";

import { getArticleByFilename } from "@/helper/server/article";
import IconTechnology from "@/component/IconTechnology";
import Link from "@/component/Link";
import ScrollShadowChips from "@/component/ScrollShadowChips";

function renderItem(item: ReactNode, isLink: boolean, technology: string) {
  return isLink ? (
    <Link href={`/blog?technologies=${technology}`} isPlain>
      {item}
    </Link>
  ) : (
    item
  );
}

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
        startContent: renderItem(
          <IconTechnology
            key={technology}
            {...propsIcon}
            technology={technology}
          />,
          isLink,
          technology
        ),
        children: renderItem(technology, isLink, technology),
      }))}
    />
  );
}
