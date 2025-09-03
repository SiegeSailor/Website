import { ComponentProps } from "react";
import { Route } from "next";
import { Chip } from "@heroui/react";

import { getEntries } from "@/helper/utility";
import { TECHNOLOGY_ICON } from "@/setting/icon";

export const STATUS = ["Draft", "Ready", "Archived"] as const;
export const STATUS_SET = new Set(STATUS);
export const STATUS_COLOR = {
  Draft: "warning",
  Ready: "success",
  Archived: "default",
} satisfies Readonly<Record<string, ComponentProps<typeof Chip>["color"]>>;

export const STAGE = ["Prototype", "Development", "Production"] as const;
export const STAGE_COLOR = {
  Prototype: "default",
  Development: "primary",
  Production: "success",
} satisfies Readonly<Record<string, ComponentProps<typeof Chip>["color"]>>;

export const TECHNOLOGIES = getEntries(TECHNOLOGY_ICON).map(([key]) => key);
export const TECHNOLOGY_SET = new Set(TECHNOLOGIES);

export const AUTHOR = "Jin Yu Zhang" as const;

export const TITLE = `${AUTHOR}'s Website` as const;
export const DESCRIPTION =
  `${AUTHOR}'s personal website, showcasing my profile, projects, blog, and notes.` as const;

export const DOMAIN_PATH = {
  article: "public/article",
  document: "public/document",
} as const;

type TTitle = "Home" | "Blog" | "Profile";

export const ROUTE_TITLE: Readonly<Record<Route, TTitle>> = {
  "/": "Home",
  "/blog": "Blog",
  "/profile": "Profile",
} as const;

export const TITLE_ROUTE = Object.fromEntries(
  getEntries(ROUTE_TITLE).map(([route, title]) => [title, route])
) as Readonly<Record<TTitle, Route>>;
