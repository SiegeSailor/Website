import type { MetadataRoute } from "next";

import { ROUTES } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";
import { getSite } from "@/helpers/server/content";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, { site }] = await Promise.all([getArticles(), getSite()]);
  const origin = `https://${site.domain}`;

  return [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${origin}${ROUTES.about}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articles.map((article) => {
      return {
        url: `${origin}${article.metadata.route}`,
        lastModified: new Date(article.metadata.updatedOn),
        changeFrequency: "monthly" as const,
        priority: 0.3,
      };
    }),
  ];
}
