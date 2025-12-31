"use client";

import { usePathname } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import clsx from "clsx";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";
import { useArticleStore } from "@/stores/article";

export default function () {
  const articles = useArticleStore((state) => state.articles);

  const pathname = usePathname();

  const loader = useTopLoader();

  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Blog"
        color="default"
        className="p-4"
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Blog">
          {articles.map((article) => {
            return (
              <ListboxItem
                classNames={{
                  title: clsx("font-light truncate text-medium", {
                    "font-semibold": pathname === article.metadata.route,
                  }),
                }}
                onClick={() => loader.start()}
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
