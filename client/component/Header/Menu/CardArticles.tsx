"use client";

import { usePathname } from "next/navigation";

import { getArticles } from "@/helper/server/article";
import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";

export default function ({
  articles,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
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
                classNames={{ title: "font-light truncate" }}
                description={article.metadata.title}
                href={article.metadata.route}
                key={article.metadata.route}
                title={article.metadata.date}
              />
            );
          })}
        </ListboxSection>
      </Listbox>
    </Card>
  );
}
