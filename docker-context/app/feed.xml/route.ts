import { AUTHOR, DESCRIPTION, DOMAIN, TITLE } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";

export const dynamic = "force-static";

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => {
    switch (character) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      default:
        return "&quot;";
    }
  });

export async function GET() {
  const articles = await getArticles();
  const site = `https://${DOMAIN}`;

  const items = articles
    .map((article) => {
      const { title, route, description, category, date } = article.metadata;
      const url = `${site}${route}`;
      return [
        "    <item>",
        `      <title>${escapeXml(title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(date).toUTCString()}</pubDate>`,
        `      <category>${escapeXml(category)}</category>`,
        `      <description>${escapeXml(description)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(TITLE)}</title>`,
    `    <link>${site}</link>`,
    `    <description>${escapeXml(DESCRIPTION)}</description>`,
    "    <language>en-us</language>",
    `    <managingEditor>${escapeXml(AUTHOR)}</managingEditor>`,
    `    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
