import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { ROUTE_TO_TITLE } from "@/setting/site";
import CardHighlight from "@/component/CardHighlight";
import TableArticles from "@/component/TableArticles";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/blog"]),
};

const HIGHLIGHTS = ["2025-11-02", "2025-10-01", "2025-09-14"].sort(
  (left, right) => right.localeCompare(left)
);

export default function () {
  return (
    <section className="max-w-content mx-auto p-4 flex flex-col gap-8">
      <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full mx-auto">
        {HIGHLIGHTS.map((date) => (
          <CardHighlight
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
            date={date}
            key={date}
          />
        ))}
      </div>

      <TableArticles />
    </section>
  );
}
