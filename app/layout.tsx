import { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { DESCRIPTION, TITLE } from "@/setting/site";
import { getArticles } from "@/helper/server/article";
import { getProfile } from "@/helper/server/document";
import Entry from "@/component/Entry";
import Header from "@/component/Header";
import Provider from "@/component/Provider";

const FontRoboto = Roboto({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    icons: { icon: "/image/favicon.ico" },
  };
}

export async function generateViewport(): Promise<Viewport> {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "white" },
      { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
  };
}

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const articles = await getArticles();
  const profile = await getProfile();

  return (
    <html suppressHydrationWarning lang="en">
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
