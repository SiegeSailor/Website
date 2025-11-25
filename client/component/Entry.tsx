"use client";

import { ReactNode, useEffect, useState } from "react";

import { TArticle } from "@/helper/server/article";
import { TProfile } from "@/helper/server/document";
import { useArticleStore } from "@/store/article";
import { useDocumentStore } from "@/store/document";

export default function ({
  articles,
  children,
  profile,
}: Readonly<{
  articles: TArticle[];
  children: ReactNode;
  profile: TProfile;
}>) {
  const parseArticles = useArticleStore((state) => state.parseArticles);
  const setProfile = useDocumentStore((state) => state.setProfile);

  const [isParsed, setIsParsed] = useState(false);

  useEffect(() => {
    parseArticles(articles);
    setProfile(profile);

    setIsParsed(true);
  }, [articles]);

  if (!isParsed) return null;

  return children;
}
