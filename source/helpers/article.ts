import type { Route } from "next";

import { getSlugByTitle } from "@/helpers/utility";

export function getAnchorsByContent(content: string, prefixRoute: Route) {
  const lines = content.split("\n");
  const result: {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    title: string;
    identifier: string;
    route: Route;
  }[] = [];

  const slugCount: Record<string, number> = {};
  let isInCodeBlock = false;

  for (const line of lines) {
    if (/^```|^~~~/.test(line.trim())) {
      isInCodeBlock = !isInCodeBlock;
      continue;
    }
    if (isInCodeBlock) continue;

    const match = line.match(/^(#{1,6}) (.*)/);
    if (match) {
      const level = match[1].length as (typeof result)[number]["level"];
      if (level < 1 || level > 6) continue;
      const title = match[2].trim();
      if (title.length === 0) continue;

      const slug = getSlugByTitle(title);
      let identifier = slug;
      if (slug in slugCount) {
        slugCount[slug] += 1;
        identifier = `${slug}-${slugCount[slug]}`;
      } else {
        slugCount[slug] = 0;
      }

      const route = `${prefixRoute}#${identifier}` as Route;

      result.push({ level, title, identifier, route });
    }
  }

  return result;
}
