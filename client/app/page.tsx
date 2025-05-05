import React from "react";
import * as next from "next";

import { generateTitle } from "@/helper";
import CardBlog from "@/component/CardBlog";
import CardExperience from "@/component/CardExperience";
import CardSummary from "@/component/CardSummary";
import CardProject from "@/component/CardProject";
import CardSkill from "@/component/CardSkill";
import ContentHero from "@/component/ContentHero";

export const metadata: next.Metadata = {
  title: generateTitle("Home"),
};

export default function () {
  return (
    <section className="flex flex-col items-center justify-center gap-12">
      <ContentHero />
      <div className="gap-2 grid grid-cols-12 grid-rows-2 p-2 w-full">
        <CardSummary className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardExperience className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] w-full" />
        <CardBlog className="col-span-12 sm:col-span-6 md:col-span-5 h-[300px] w-full" />
        <CardProject className="col-span-12 md:col-span-7 h-[300px] w-full" />
      </div>
    </section>
  );
}
