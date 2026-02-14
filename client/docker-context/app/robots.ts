import { type MetadataRoute } from "next";

import { DOMAIN } from "@/settings/constant";

const AI_SCRAPERS = [
  "AdsBot-Google",
  "Amazonbot",
  "anthropic-ai",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "cohere-ai",
  "cohere-training",
  "Diffbot",
  "FacebookBot",
  "FriendlyCrawler",
  "Google-Extended",
  "GoogleOther",
  "GoogleOther-Image",
  "GoogleOther-Video",
  "GPTBot",
  "iaskspider/2.0",
  "ICC-Crawler",
  "ImagesiftBot",
  "img2dataset",
  "ISSCyberRiskCrawler",
  "Kangaroo Bot",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "OAI-SearchBot",
  "omgili",
  "omgilibot",
  "PetalBot",
  "Scrapy",
  "Timpibot",
  "VelenPublicWebCrawler",
  "Webzio-Extended",
  "YouBot",
] as const;

const NON_AI_SCRAPERS = [
  "AhrefsBot",
  "Barkrowler",
  "BLEXBot",
  "DataForSeoBot",
  "DotBot",
  "Grapeshot",
  "MJ12bot",
  "PetalBot",
  "SemrushBot",
  "SeznamBot",
  "sogou",
  "Sogou",
  "ZoominfoBot",
] as const;

const BLOCKED_BOTS = [...AI_SCRAPERS, ...NON_AI_SCRAPERS] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/private/",
      },
      ...BLOCKED_BOTS.map((bot) => ({
        userAgent: bot,
        disallow: "/",
      })),
    ],
    sitemap: `https://${DOMAIN}/sitemap.xml`,
  };
}
