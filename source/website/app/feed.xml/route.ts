import { getArticles } from "@/helpers/server/article";
import { getSite } from "@/helpers/server/content";

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
  const [articles, { identity, site: identitySite }] = await Promise.all([
    getArticles(),
    getSite(),
  ]);
  const site = `https://${identitySite.domain}`;

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
    `    <title>${escapeXml(identitySite.title)}</title>`,
    `    <link>${site}</link>`,
    `    <description>${escapeXml(identitySite.description)}</description>`,
    "    <language>en-us</language>",
    `    <managingEditor>${escapeXml(identity.display)}</managingEditor>`,
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
