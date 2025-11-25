import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { ROUTE_TO_TITLE } from "@/setting/site";
import TableArticles from "@/component/TableArticles";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/blog"]),
};

export default function () {
  return (
    <section className="max-w-content mx-auto p-4">
      <TableArticles />
    </section>
  );
}
