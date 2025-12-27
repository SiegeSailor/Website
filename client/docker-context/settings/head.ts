import { Viewport, Metadata } from "next";
import { Roboto } from "next/font/google";

import { TITLE, DESCRIPTION, DOMAIN } from "./constant";

export const globalFontRoboto = Roboto({ subsets: ["latin"] });

export const globalMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: "/images/favicon.ico",
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `https://${DOMAIN}`,
    siteName: TITLE,
    images: [
      {
        url: `https://${DOMAIN}/images/Jin-Yu-Zhang-Profile.jpg`,
        width: 1200,
        height: 630,
        alt: TITLE,
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: `https://${DOMAIN}/images/Jin-Yu-Zhang-Profile.jpg`,
        width: 1200,
        height: 630,
        alt: TITLE,
        type: "image/jpeg",
      },
    ],
  },
};

export const globalViewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};
