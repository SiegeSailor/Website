import { Metadata } from "next";

import { generateTitle } from "@/helper/utility";
import { ROUTE_TITLE } from "@/setting/site";
import CardBlog from "@/component/CardBlog";
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
    <section className="flex flex-col items-center justify-center gap-12 p-4">
      <ContentHero />
      <div className="gap-4 grid grid-cols-12 grid-rows-2 w-full">
        <CardSummary className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardExperience className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardProject className="col-span-12 h-[300px] w-full" />
      </div>
      <ContentArticles />
    </section>
  );
}
