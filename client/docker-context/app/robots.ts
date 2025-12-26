import type { MetadataRoute } from "next";

import { DOMAIN } from "@/settings/constant";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `https://${DOMAIN}/sitemap.xml`,
  };
}
