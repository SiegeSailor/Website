"use client";

import { ReactNode, useEffect, useState } from "react";

import { getArticles } from "@/helper/server/article";
import { useArticleStore } from "@/store/article";

export default function Wrapper({
  articles,
  children,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
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
