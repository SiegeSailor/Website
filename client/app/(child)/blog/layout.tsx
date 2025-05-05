import React from "react";
import * as next from "next";

import { generateTitle } from "@/helper";
import { getArticles } from "@/file";

export const metadata: next.Metadata = {
  title: generateTitle("Blog"),
};

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const articles = await getArticles();
  return <section>{children}</section>;
}
