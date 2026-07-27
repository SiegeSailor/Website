import type { Viewport, Metadata } from "next";
import { Roboto } from "next/font/google";

import { type TSite } from "@/helpers/server/content";

export const globalFontRoboto = Roboto({ subsets: ["latin"] });

// Card dimensions and locale are format, not content, so they stay here; every
// string comes from source/content/resume/site-identity.yaml. Built from `site` rather
// than imported as a constant so the content graph stays server-side.
const CARD = { width: 1200, height: 630, type: "image/jpeg" } as const;

export function createGlobalMetadata(site: TSite): Metadata {
  const url = `https://${site.domain}`;
  const images = [{ url: `${url}${site.image}`, alt: site.title, ...CARD }];

  return {
    title: site.title,
    description: site.description,
    icons: "/images/favicon.ico",
    alternates: {
      types: {
        "application/rss+xml": [
          { url: "/feed.xml", title: `${site.title} — RSS` },
        ],
      },
    },
    openGraph: {
      title: site.title,
      description: site.description,
      url,
      siteName: site.title,
      images,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images,
    },
  };
}

export const globalViewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  userScalable: false,
  maximumScale: 1.0,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
