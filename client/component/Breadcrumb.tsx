"use client";

import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { ComponentProps, useMemo } from "react";
import { Route } from "next";
import { usePathname } from "next/navigation";

import { getArticles } from "@/helper/server/article";
import { ROUTE_TITLE, TITLE_ROUTE } from "@/setting/site";

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

  const breadcrumbs = useMemo(() => {
    const results: { name: string; href: Route }[] = [
      { name: ROUTE_TITLE["/"], href: TITLE_ROUTE["Home"] },
    ];

    const paths = pathname.split("/");
    paths.forEach((path) => {
      if (path === "") return;

      if (path in ROUTE_TITLE) {
        const name = ROUTE_TITLE[path as keyof typeof ROUTE_TITLE];
        results.push({ name, href: TITLE_ROUTE[name] });
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
            item: "block truncate max-w-40 sm:max-w-[28rem] md:max-w-[36rem] lg:max-w-[52rem]",
            ...propsItem?.classNames,
          }}
        >
          {breadcrumb.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
