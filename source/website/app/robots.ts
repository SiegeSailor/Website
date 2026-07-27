import { type MetadataRoute } from "next";

import { SCRAPERS_AI, SCRAPERS_NON_AI } from "@/settings/constant";
import { getSite } from "@/helpers/server/content";

export const revalidate = false;

export default async function (): Promise<MetadataRoute.Robots> {
  const { site } = await getSite();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/private/",
      },
      ...[...SCRAPERS_AI, ...SCRAPERS_NON_AI].map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
    ],
    sitemap: `https://${site.domain}/sitemap.xml`,
  };
}
