"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { ComponentProps, useMemo } from "react";
import { Route } from "next";
import { usePathname } from "next/navigation";

import { ROUTE_TO_TITLE, TITLE_TO_ROUTE } from "@/setting/site";
import { useArticleStore } from "@/store/article";

export default function ({
  propsContainer,
  propsItem,
}: Readonly<{
  propsContainer?: ComponentProps<typeof Breadcrumbs>;
  propsItem?: ComponentProps<typeof BreadcrumbItem>;
}>) {
  const articles = useArticleStore((state) => state.articles);

  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const results: { name: string; href: Route }[] = [];

    const paths = pathname.split("/");
    paths.forEach((path) => {
      const pathWithSlash = `/${path}`;
      if (pathWithSlash in ROUTE_TO_TITLE) {
        const name =
          ROUTE_TO_TITLE[pathWithSlash as keyof typeof ROUTE_TO_TITLE];
        results.push({ name, href: TITLE_TO_ROUTE[name] });
        return;
      }

      if (/^\d{4}-\d{2}-\d{2}$/.test(path)) {
        const article = articles.find((article) => {
          return article?.metadata.date === path;
        });
        if (!article) return;

        results.push({
          name: article.metadata.title,
          href: article.metadata.route,
        });
        return;
      }
    });

    return results;
  }, [pathname, articles]);

  return (
    <Breadcrumbs
      {...propsContainer}
      classNames={{
        list: "overflow-hidden flex-nowrap",
        ...propsContainer?.classNames,
      }}
    >
      {breadcrumbs.map((breadcrumb) => (
        <BreadcrumbItem
          href={breadcrumb.href}
          key={breadcrumb.name}
          {...propsItem}
          classNames={{
            item: "block truncate max-w-[calc(100vw-12rem)] sm:max-w-md md:max-w-xl lg:max-w-208",
            ...propsItem?.classNames,
          }}
        >
          {breadcrumb.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
