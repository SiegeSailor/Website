import { Metadata } from "next";

import { createPageTitle } from "@/helper/utility";
import { ROUTE_TO_TITLE } from "@/setting/site";
import ContentArticles from "@/component/ContentArticles";
import ContentProfile from "@/component/ContentProfile";
import ContentHighlights from "@/component/ContentHighlights";
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
        <ContentArticles className="w-full mx-auto" />
        <ContentProfile className="w-full mx-auto" />
        <ContentProjects className="w-full mx-auto" />
        <ContentHighlights className="w-full mx-auto" />
      </div>
    </section>
  );
}
