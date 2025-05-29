import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { getArticles } from "@/helper/article";
import { ROUTE_TITLE } from "@/setting/site";
import TableArticles from "@/component/TableArticles";

export const metadata: Metadata = {
  title: generateTitle(ROUTE_TITLE["/blog"]),
};

export default async function () {
  const articles = await getArticles();

  return (
    <section className={clsx("p-4 max-w-[880px] mx-auto")}>
      <TableArticles articles={articles} />
    </section>
  );
}
