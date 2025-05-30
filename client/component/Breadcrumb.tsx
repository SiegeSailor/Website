"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { ComponentProps } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { getArticles } from "@/helper/article";
import { ROUTE_TITLE } from "@/setting/site";

export default function ({
  propsContainer,
  propsItem,
  articles,
}: Readonly<{
  propsContainer?: ComponentProps<typeof Breadcrumbs>;
  propsItem?: ComponentProps<typeof BreadcrumbItem>;
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
  const pathname = usePathname();

  const paths = pathname.split("/");
  const breadcrumbs = paths.map((path, index) => {
    const href = (index != 0 ? paths[index - 1] : "") + "/" + path;
    let name = path;
    if (href in ROUTE_TITLE) {
      name = ROUTE_TITLE[href as keyof typeof ROUTE_TITLE];
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
      {...propsContainer}
      className={clsx(propsContainer?.className)}
    >
      {breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem
          {...propsItem}
          key={breadcrumb.name}
          href={breadcrumb.href}
        >
          {breadcrumb.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
