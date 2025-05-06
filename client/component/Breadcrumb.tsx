"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import clsx from "clsx";
import * as navigation from "next/navigation";

import { site } from "@/setting";
import { getArticles } from "@/file";

export default function ({
  propsBreadcrumbs,
  propsBreadcrumbItem,
  articles,
}: {
  propsBreadcrumbs?: React.ComponentProps<typeof Breadcrumbs>;
  propsBreadcrumbItem?: React.ComponentProps<typeof BreadcrumbItem>;
  articles: Awaited<ReturnType<typeof getArticles>>;
}) {
  const pathname = navigation.usePathname();

  const paths = pathname.split("/");
  const breadcrumbs = paths.map((path, index) => {
    const href = (index != 0 ? paths[index - 1] : "") + "/" + path;
    let name = path;
    if (href in site.pathMap) {
      name = site.pathMap[href as keyof typeof site.pathMap];
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(path)) {
      name =
        articles.find((article) => article.metadata.date === path)?.metadata
          .title || path;
    }

    return {
      name,
      href,
    };
  });

  return (
    <Breadcrumbs
      {...propsBreadcrumbs}
      className={clsx(propsBreadcrumbs?.className)}
    >
      {breadcrumbs.map((item) => (
        <BreadcrumbItem
          {...propsBreadcrumbItem}
          key={item.name}
          href={item.href}
        >
          {item.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
