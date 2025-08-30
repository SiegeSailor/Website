"use server";

import { Metadata } from "next";

import { generateTitle } from "@/helper/utility";
import { getArticles } from "@/helper/server/article";
import { ROUTE_TITLE } from "@/setting/site";
import TableArticles from "./TableArticles";

export async function generateMetadata(): Promise<Metadata> {
  return { title: generateTitle(ROUTE_TITLE["/blog"]) };
}

export default async function () {
  const articles = await getArticles();

  return (
    <section className="max-w-content mx-auto p-4">
      <TableArticles articles={articles} />
    </section>
  );
}
