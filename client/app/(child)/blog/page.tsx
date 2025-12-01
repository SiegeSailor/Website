import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { getArticles } from "@/helper/server/article";
import { ROUTE_TO_TITLE } from "@/setting/site";
import CardArticleDetail from "@/component/CardArticleDetail";
import CardArticleHighlight from "@/component/CardArticleHighlight";
import CardArticleSimple from "@/component/CardArticleSimple";
import ScrollShadowTechnologiesFlatten from "@/component/ScrollShadowTechnologiesFlatten";
import TableArticles from "@/component/TableArticles";
import DivisionSticky from "@/component/DivisionSticky";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/blog"]),
};

const HIGHLIGHTS = ["2025-11-02", "2025-10-01"] as const;

export default async function () {
  const articles = await getArticles();

  return (
    <section className="max-w-content mx-auto p-4">
      <div className="md:hidden gap-4 grid grid-cols-12 grid-rows-1 w-full mx-auto">
        {articles.map((article) => (
          <CardArticleDetail
            className="col-span-12 sm:col-span-6 h-[300px]"
            date={article.metadata.date}
            key={article.metadata.date}
          />
        ))}
      </div>

      <div className="hidden md:grid gap-8 grid-cols-12 grid-rows-1">
        <div className="col-span-8 flex flex-col gap-8">
          <TableArticles />
        </div>

        <DivisionSticky className="col-span-4 flex flex-col gap-8 p-1 max-h-[calc(100vh-8rem)]">
          <div className="flex flex-col gap-4">
            <h4 className="text-medium font-semibold">Highlights</h4>
            <div className="flex flex-col gap-2">
              {HIGHLIGHTS.map((date) => (
                <CardArticleHighlight
                  className="w-full"
                  date={date}
                  key={date}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-medium font-semibold">Technologies</h4>
            <ScrollShadowTechnologiesFlatten />
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-medium font-semibold">Latests</h4>
            <div className="flex flex-col gap-2">
              {articles.slice(0, 4).map((article) => (
                <CardArticleSimple
                  className="w-full"
                  filename={article.filename}
                  isMultiple
                  key={article.filename}
                />
              ))}
            </div>
          </div>
        </DivisionSticky>
      </div>
    </section>
  );
}
