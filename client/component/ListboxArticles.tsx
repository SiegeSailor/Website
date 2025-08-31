"use client";

import { Route } from "next";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";

import { getArticles } from "@/helper/server/article";
import { ROUTE_ICON } from "@/setting/icon";
import { ROUTE_TITLE } from "@/setting/site";

const ROUTES: Route[] = ["/blog"];

export default function ({
  articles,
  date,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
  date: Awaited<ReturnType<typeof getArticles>>[number]["metadata"]["date"];
}>) {
  const article = articles.find((article) => article.metadata.date === date);

  if (!article) return null;

  return (
    <Listbox
      aria-label="Articles"
      color="default"
      className="p-4"
      disabledKeys={[date]}
      hideSelectedIcon
      variant="flat"
    >
      <ListboxSection
        title={`${article.metadata.category} Articles`}
        showDivider
      >
        {articles
          .filter(
            (item) => item.metadata.category === article.metadata.category
          )
          .map((item) => {
            return (
              <ListboxItem
                classNames={{ title: "font-light" }}
                href={item.metadata.route}
                key={item.metadata.date}
                title={item.metadata.title}
              />
            );
          })}
      </ListboxSection>
      <ListboxSection title="Recent Articles" showDivider>
        {articles.slice(0, 5).map((item) => {
          return (
            <ListboxItem
              classNames={{ title: "font-light truncate" }}
              description={item.metadata.title}
              href={item.metadata.route}
              key={item.metadata.date}
              title={item.metadata.date}
            />
          );
        })}
      </ListboxSection>
      <>
        {ROUTES.map((route) => {
          const Icon = ROUTE_ICON[route];

          return (
            <ListboxItem
              classNames={{ title: "font-light" }}
              endContent={<Icon size="1rem" strokeWidth="0.1rem" />}
              key={route}
              href={route}
              title={`Back to ${ROUTE_TITLE[route]}`}
            />
          );
        })}
      </>
    </Listbox>
  );
}
