import { type Route } from "next";

import { getEntries } from "@/helpers/utility";
import { TECHNOLOGY_TO_ICON } from "@/settings/icons";

export const STATUS = ["Draft", "Ready", "Archived"] as const;
export const STATUS_SET = new Set(STATUS);

export const TECHNOLOGIES = getEntries(TECHNOLOGY_TO_ICON).map(([key]) => key);
export const TECHNOLOGY_SET = new Set(TECHNOLOGIES);

// Paths are routing, so they stay in code and stay typed; the *titles* for these
// paths are content, in source/content/resume/routes.yaml, read server-side through
// `getSite().titleOf`. "/blog" is a route *prefix* for article pages
// (/blog/[date]) — there is no /blog index page, so it is not a typedRoutes
// `Route` on its own.
export const ROUTES = {
  home: "/",
  blog: "/blog",
  about: "/about",
} as const satisfies Record<string, string>;

// "/blog" has no page of its own, so typedRoutes does not know it as a `Route`;
// the cast is what the previous title-keyed map was doing implicitly.
export const ROUTE_HOME = ROUTES.home as Route;
export const ROUTE_BLOG = ROUTES.blog as Route;

export const SCRAPERS_AI = [
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
export const SCRAPERS_NON_AI = [
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
