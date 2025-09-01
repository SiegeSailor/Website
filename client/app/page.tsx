import { Metadata } from "next";

import { generateTitle } from "@/helper/utility";
import { ROUTE_TITLE } from "@/setting/site";
import CardExperience from "@/component/CardExperience";
import CardPublication from "@/component/CardPublication";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentArticles from "@/component/ContentArticles";
import ContentHero from "@/component/ContentHero";

export async function generateMetadata(): Promise<Metadata> {
  return { title: generateTitle(ROUTE_TITLE["/"]) };
}

export default async function () {
  return (
    <section className="max-w-compact mx-auto p-4">
      <div className="flex flex-col gap-24">
        <ContentHero />

        <div className="gap-4 grid grid-cols-12 grid-rows-1">
          <CardSummary className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
          <CardExperience
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
            classNameHeight="h-[268px]"
          />
          <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
          <CardPublication className="col-span-12 sm:col-span-6 md:col-span-12 h-[300px]" />
        </div>

        <ContentArticles />
      </div>
    </section>
  );
}
