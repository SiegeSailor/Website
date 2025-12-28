import type { Metadata } from "next";

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
    <section className="max-w-content mx-auto p-4">
      <div className="flex flex-col gap-24">
        <ContentHero className="max-w-compact mx-auto" />
        <ContentArticles className="mx-auto" />
        <ContentProfile className="mx-auto" />
        <ContentProjects className="mx-auto" />
        <ContentHighlights className="mx-auto" />
      </div>
    </section>
  );
}
