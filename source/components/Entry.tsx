"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

import { TArticle } from "@/helpers/server/article";
import { useArticleStore } from "@/stores/article";

export default function ({
  articles,
  children,
}: Readonly<{
  articles: TArticle[];
  children: ReactNode;
}>) {
  const parseArticles = useArticleStore((state) => state.parseArticles);

  useEffect(() => {
    parseArticles(articles);
  }, [articles, parseArticles]);

  return children;
}
