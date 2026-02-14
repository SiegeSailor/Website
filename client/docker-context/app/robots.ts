import { type MetadataRoute } from "next";

import { DOMAIN, SCRAPERS_AI, SCRAPERS_NON_AI } from "@/settings/constant";

export default function (): MetadataRoute.Robots {
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
    sitemap: `https://${DOMAIN}/sitemap.xml`,
  };
}
