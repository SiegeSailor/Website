"use client";

import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";

import { getArticles } from "@/helper/article";

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
      selectionMode="none"
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
                classNames={{ title: "font-medium" }}
                href={`/blog/${item.metadata.date}`}
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
              classNames={{ title: "font-medium truncate" }}
              description={item.metadata.title}
              href={`/blog/${item.metadata.date}`}
              key={item.metadata.date}
              title={item.metadata.date}
            />
          );
        })}
      </ListboxSection>
      <ListboxItem
        classNames={{ title: "font-medium" }}
        href="/"
        title="Homepage"
      />
    </Listbox>
  );
}
