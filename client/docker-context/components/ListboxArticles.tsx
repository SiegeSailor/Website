"use client";

import { Route } from "next";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";

import { ROUTE_TO_ICON } from "@/settings/icon";
import { ROUTE_TO_TITLE } from "@/settings/constant";
import { TArticle } from "@/helpers/server/article";
import { useArticleStore } from "@/stores/article";

const ROUTES: Route[] = ["/blog"];

export default function ({
  date,
}: Readonly<{
  date: TArticle["metadata"]["date"];
}>) {
  const articles = useArticleStore((state) => state.articles);

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
              description={item.metadata.date}
              href={item.metadata.route}
              key={item.metadata.date}
              title={item.metadata.title}
            />
          );
        })}
      </ListboxSection>
      <>
        {ROUTES.map((route) => {
          const Icon = ROUTE_TO_ICON[route];

          return (
            <ListboxItem
              classNames={{ title: "font-light" }}
              endContent={<Icon size="1rem" strokeWidth="0.1rem" />}
              key={route}
              href={route}
              title={`Go Back to ${ROUTE_TO_TITLE[route]}`}
            />
          );
        })}
      </>
    </Listbox>
  );
}
