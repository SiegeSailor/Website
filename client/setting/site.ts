import { Route } from "next";

export const NAME = "Jin Yu Zhang's Website" as const;

export const DOMAIN_PATH = { article: "public/article" } as const;

export const ROUTE_TITLE = { "/": "Home", "/blog": "Blog" } as Readonly<
  Record<Route, string>
>;
