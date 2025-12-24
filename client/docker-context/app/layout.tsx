import { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/styles/global.css";
import { DESCRIPTION, DOMAIN, TITLE } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";
import { getProfile } from "@/helpers/server/document";
import Entry from "@/components/Entry";
import Header from "@/components/Header";
import Provider from "@/components/Provider";

const FontRoboto = Roboto({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: { icon: "/image/favicon.ico" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `https://${DOMAIN}`,
    siteName: TITLE,
    images: [
      {
        url: `https://${DOMAIN}/image/Jin-Yu-Zhang-Profile.jpg`,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`https://${DOMAIN}/image/Jin-Yu-Zhang-Profile.jpg`],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const articles = await getArticles();
  const profile = await getProfile();

  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(FontRoboto.className, "overscroll-none")}
      >
        <Provider>
          <div className="h-screen flex flex-col">
            <Header />
            <main className="mx-auto px-4 grow pt-4 sm:pt-8">
              <Entry articles={articles} profile={profile}>
                {children}
              </Entry>
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
