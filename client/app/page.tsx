import { Metadata } from "next";
import clsx from "clsx";

import { generateTitle } from "@/helper/utility";
import { ROUTE_TITLE } from "@/setting/site";
import CardExperience from "@/component/CardExperience";
import CardProject from "@/component/CardProject";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentArticles from "@/component/ContentArticles";
import ContentHero from "@/component/ContentHero";
import { getProfile } from "@/helper/document";

export const metadata: Metadata = {
  title: generateTitle(ROUTE_TITLE["/"]),
};

export default async function () {
  const { metadata } = await getProfile();

  return (
    <section className={clsx("max-w-compact mx-auto p-4")}>
      <div className="flex flex-col gap-24">
        <ContentHero />
        <ContentArticles />
        <div className="gap-4 grid grid-cols-12 grid-rows-1">
          <CardSummary
            className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
            experience={metadata.status.experience}
          />
          <CardExperience className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
          <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
          <CardProject className="col-span-12 sm:col-span-6 md:col-span-12 h-[300px]" />
        </div>
      </div>
    </section>
  );
}
