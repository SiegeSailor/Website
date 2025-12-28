import type { Metadata } from "next";

import { createPageTitle } from "@/helpers/utility";
import { getArticles } from "@/helpers/server/article";
import { HIGHLIGHTS } from "@/settings/home";
import { ROUTE_TO_TITLE } from "@/settings/constant";
import CardArticleDetail from "@/components/CardArticleDetail";
import CardArticleHighlight from "@/components/CardArticleHighlight";
import CardArticleSimple from "@/components/CardArticleSimple";
import ScrollShadowTechnologiesFlatten from "@/components/ScrollShadowTechnologiesFlatten";
import TableArticles from "@/components/TableArticles";
import DivisionSticky from "@/components/DivisionSticky";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/blog"]),
};

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

        <DivisionSticky className="col-span-4 flex flex-col gap-8 p-1">
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
