import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { ROUTE_TO_TITLE } from "@/setting/site";
import CardExperience from "@/component/CardExperience";
import CardPublication from "@/component/CardPublication";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentArticles from "@/component/ContentArticles";
import ContentHero from "@/component/ContentHero";
import ContentProjects from "@/component/ContentProjects";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/"]),
};

export default function () {
  return (
    <section className="w-full max-w-content mx-auto p-4">
      <div className="flex flex-col gap-24">
        <ContentHero className="w-full max-w-compact mx-auto" />

        <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full max-w-compact mx-auto">
          <CardSummary
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
            classNameHeight="h-[228px]"
          />
          <CardExperience
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
            classNameHeight="h-[228px]"
          />
          <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
          <CardPublication className="col-span-12 sm:col-span-6 md:col-span-12 h-[300px]" />
        </div>

        <ContentProjects className="w-full mx-auto" />
        <ContentArticles className="w-full mx-auto" />
      </div>
    </section>
  );
}
