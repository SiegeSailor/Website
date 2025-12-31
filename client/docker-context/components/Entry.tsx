"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import NextTopLoader from "nextjs-toploader";

import { TArticle } from "@/helpers/server/article";
import { TProfile } from "@/helpers/server/document";
import { useArticleStore } from "@/stores/article";
import { useDocumentStore } from "@/stores/document";
import SpinnerCenter from "@/components/SpinnerCenter";

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

  return (
    <>
      <NextTopLoader color="hsl(var(--heroui-primary))" />
      {!isParsed ? <SpinnerCenter /> : children}
    </>
  );
}
