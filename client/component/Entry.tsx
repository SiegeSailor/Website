"use client";

import { ReactNode, useEffect, useState } from "react";

import { TArticle } from "@/helper/server/article";
import { useArticleStore } from "@/store/article";

export default function Wrapper({
  articles,
  children,
}: Readonly<{
  articles: TArticle[];
  children: ReactNode;
}>) {
  const parseArticles = useArticleStore((state) => state.parseArticles);

  const [isParsed, setIsParsed] = useState(false);

  useEffect(() => {
    parseArticles(articles);
    setIsParsed(true);
  }, [articles]);

  if (!isParsed) return null;

  return <>{children}</>;
}
