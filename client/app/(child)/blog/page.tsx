import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { ROUTE_TITLE } from "@/setting/site";
import TableArticles from "@/component/TableArticles";

export async function generateMetadata(): Promise<Metadata> {
  return { title: createPageTitle(ROUTE_TITLE["/blog"]) };
}

export default async function () {
  return (
    <section className="max-w-content mx-auto p-4">
      <TableArticles />
    </section>
  );
}
