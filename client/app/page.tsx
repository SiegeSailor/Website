import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { HIGHLIGHTS } from "@/setting/home";
import { ROUTE_TO_TITLE } from "@/setting/site";
import CardExperience from "@/component/CardExperience";
import CardPublication from "@/component/CardPublication";
import CardSkill from "@/component/CardSkill";
import CardSummary from "@/component/CardSummary";
import ContentArticles from "@/component/ContentArticles";
import CardArticleDetail from "@/component/CardArticleDetail";
import ContentHero from "@/component/ContentHero";
import ContentProjects from "@/component/ContentProjects";
import Link from "@/component/Link";
import ChartLineArticle from "@/component/ChartLineArticle";

export const metadata: Metadata = {
  title: createPageTitle(ROUTE_TO_TITLE["/"]),
};

export default function () {
  return (
    <section className="w-full max-w-content mx-auto p-4">
      <div className="flex flex-col gap-24">
        <ContentHero className="w-full max-w-compact mx-auto" />

        <ContentArticles className="w-full mx-auto" />

        <div className="flex flex-col gap-12">
          <div className="w-full flex flex-col gap-2 max-w-compact mx-auto">
            <h4 className="text-2xl sm:text-3xl font-light text-default-600 w-full text-left">
              First Glance at Me
            </h4>
            <p className="w-full text-medium text-foreground/50">
              A brief overview of my professional background, skills, and
              accomplishments. You can find more details in my{" "}
              <Link href="/profile">Profile</Link>.
            </p>
          </div>

          <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full max-w-compact mx-auto">
            <CardSummary
              className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
              classNameScrollHeight="h-[228px]"
            />
            <CardExperience
              className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]"
              classNameScrollHeight="h-[228px]"
            />
            <CardSkill className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px]" />
            <CardPublication className="col-span-12 sm:col-span-6 md:col-span-12 h-[300px]" />
          </div>
        </div>

        <ContentProjects className="w-full mx-auto" />

        <div className="flex flex-col gap-12">
          <div className="w-full flex flex-col gap-2 max-w-compact mx-auto text-right">
            <h4 className="text-2xl sm:text-3xl font-light text-default-600 w-full">
              My Highlighted Articles
            </h4>
            <p className="w-full text-medium text-foreground/50">
              A showcase of recent writings and highlights. Dive deeper in my{" "}
              <Link href="/blog">Blog</Link>.
            </p>
          </div>
          <div className="gap-4 grid grid-cols-12 grid-rows-1 w-full max-w-compact mx-auto">
            {HIGHLIGHTS.map((date) => (
              <CardArticleDetail
                className="col-span-12 sm:col-span-6 md:col-span-4 h-[300px] border-background dark:border-default-100 border-2 bg-default-50 overflow-hidden"
                date={date}
                key={date}
              />
            ))}
          </div>
          <div className="w-full flex flex-col gap-6 max-w-content mx-auto">
            <p className="text-medium text-foreground/50 max-w-compact w-full mx-auto">
              See the articles categorized by publish dates, as illustrated.
            </p>
            <div className="block sm:hidden h-[300px]">
              <ChartLineArticle xRotation={90} />
            </div>
            <div className="hidden sm:block h-[300px]">
              <ChartLineArticle xRotation={0} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
