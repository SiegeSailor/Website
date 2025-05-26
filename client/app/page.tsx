import { Metadata } from "next";

import { generateTitle } from "@/helper";
import { ROUTE_TITLE } from "@/setting/site";
import CardBlog from "@/component/CardBlog";
import CardExperience from "@/component/CardExperience";
import CardProject from "@/component/CardProject";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentHero from "@/component/ContentHero";

export const metadata: Metadata = {
  title: generateTitle(ROUTE_TITLE["/"]),
};

export default function () {
  return (
    <section className="flex flex-col items-center justify-center gap-12 p-4">
      <ContentHero />
      <div className="gap-4 grid grid-cols-12 grid-rows-2 w-full">
        <CardSummary className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardExperience className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardBlog className="col-span-12 sm:col-span-6 md:col-span-5 h-[300px] w-full" />
        <CardProject className="col-span-12 md:col-span-7 h-[300px] w-full" />
      </div>
    </section>
  );
}
