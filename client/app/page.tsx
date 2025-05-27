import { Metadata } from "next";

import { generateTitle } from "@/helper/utility";
import { ROUTE_TITLE } from "@/setting/site";
import CardExperience from "@/component/CardExperience";
import CardProject from "@/component/CardProject";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentArticles from "@/component/ContentArticles";
import ContentHero from "@/component/ContentHero";

export const metadata: Metadata = {
  title: generateTitle(ROUTE_TITLE["/"]),
};

export default async function () {
  return (
    <section className="items-center justify-center p-4">
      <div className="gap-24 grid grid-cols-1 gird-rows-3">
        <div className="flex flex-col gap-12">
          <ContentHero />
          <div className="gap-4 grid grid-cols-12 grid-rows-1">
            <CardSummary className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
            <CardExperience className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
            <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
            <CardProject className="col-span-12 sm:col-span-6 md:col-span-12 h-[300px]" />
          </div>
        </div>
        <ContentArticles />
      </div>
    </section>
  );
}
