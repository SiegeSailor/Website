"use client";

import { usePathname } from "next/navigation";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";
import { useArticleStore } from "@/store/article";

export default function () {
  const articles = useArticleStore((state) => state.articles);

  const pathname = usePathname();

  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Blog"
        color="default"
        className="p-4"
        disabledKeys={[pathname]}
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Blog">
          {articles.map((article) => {
            return (
              <ListboxItem
                classNames={{ title: "font-light truncate text-medium" }}
                description={article.metadata.date}
                href={article.metadata.route}
                key={article.metadata.route}
                title={article.metadata.title}
              />
            );
          })}
        </ListboxSection>
      </Listbox>
    </Card>
  );
}
