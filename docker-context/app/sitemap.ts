import type { MetadataRoute } from "next";

import { DOMAIN } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";

export const revalidate = false;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();

  return [
    {
      url: `https://${DOMAIN}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `https://${DOMAIN}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...articles.map((article) => {
      return {
        url: `https://${DOMAIN}${article.metadata.route}`,
        lastModified: new Date(article.metadata.updatedOn),
        changeFrequency: "monthly" as const,
        priority: 0.3,
      };
    }),
  ];
}
