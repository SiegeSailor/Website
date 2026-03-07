import type { MetadataRoute } from "next";

import { DOMAIN } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";

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
      url: `https://${DOMAIN}/profile`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `https://${DOMAIN}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
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
