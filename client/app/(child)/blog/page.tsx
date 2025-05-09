import React from "react";
import * as next from "next";

import { generateTitle } from "@/helper";
import { getArticles } from "@/file";
import { site } from "@/setting";

export const metadata: next.Metadata = {
  title: generateTitle(site.pathMap["/blog"]),
};

export default async function () {
  const articles = await getArticles();

  return <section></section>;
}
