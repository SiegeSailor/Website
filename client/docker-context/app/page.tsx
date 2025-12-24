import { Metadata } from "next";

import { createPageTitle } from "@/helpers/utility";
import { ROUTE_TO_TITLE } from "@/settings/constant";
import ContentArticles from "@/components/ContentArticles";
import ContentProfile from "@/components/ContentProfile";
import ContentHighlights from "@/components/ContentHighlights";
import ContentHero from "@/components/ContentHero";
import ContentProjects from "@/components/ContentProjects";

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
