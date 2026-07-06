import { type Route } from "next";

import { getEntries } from "@/helpers/utility";
import { TECHNOLOGY_TO_ICON } from "@/settings/icons";

export const STATUS = ["Draft", "Ready", "Archived"] as const;
export const STATUS_SET = new Set(STATUS);

export const TECHNOLOGIES = getEntries(TECHNOLOGY_TO_ICON).map(([key]) => key);
export const TECHNOLOGY_SET = new Set(TECHNOLOGIES);

export const AUTHOR = "Jin Yu Zhang" as const;
export const DOMAIN = "jinyu-zhang.com" as const;

export const TITLE = `${AUTHOR}'s Website` as const;
export const DESCRIPTION =
  `${AUTHOR}'s personal website, showcasing my profile, projects, blog, and notes.` as const;

type TTitle = "Home" | "Blog" | "About";
// "/blog" is a route *prefix* for article pages (/blog/[date]); there is no
// /blog index page, so it isn't a typedRoutes `Route` on its own — key by path.
type TPath = "/" | "/blog" | "/about";

export const ROUTE_TO_TITLE: Readonly<Record<TPath, TTitle>> = {
  "/": "Home",
  "/blog": "Blog",
  "/about": "About",
} as const;

export const TITLE_TO_ROUTE = Object.fromEntries(
  getEntries(ROUTE_TO_TITLE).map(([route, title]) => [title, route]),
) as Readonly<Record<TTitle, Route>>;

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
