import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { getArticles } from "@/helper/server/article";
import { ROUTE_TITLE } from "@/setting/site";
import TableArticles from "@/component/TableArticles";

export async function generateMetadata(): Promise<Metadata> {
  return { title: createPageTitle(ROUTE_TITLE["/blog"]) };
}

export default async function () {
  const articles = await getArticles();

  return (
    <section className="max-w-content mx-auto p-4">
      <TableArticles articles={articles} />
    </section>
  );
}
