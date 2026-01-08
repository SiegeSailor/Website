import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";

import "@/styles/global.css";
import {
  globalFontRoboto,
  globalMetadata,
  globalViewport,
} from "@/settings/heads";
import { AUTHOR } from "@/settings/constant";
import { getArticles } from "@/helpers/server/article";
import { getProfile } from "@/helpers/server/document";
import { PublicEnv } from "@/helpers/utility";
import Entry from "@/components/Entry";
import Header from "@/components/Header";
import Provider from "@/components/Provider";

export const metadata: Metadata = globalMetadata;

export const viewport: Viewport = globalViewport;

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const articles = await getArticles();
  const profile = await getProfile();

  const year = new Date().getFullYear();

  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(globalFontRoboto.className, "overscroll-none")}
      >
        <PublicEnv />

        <Provider>
          <div className="w-full h-screen flex flex-col">
            <Entry articles={articles} profile={profile}>
              <Header />
              <main className="w-full mx-auto px-4 grow pt-4 sm:pt-8">
                {children}
              </main>
            </Entry>
            <div className="text-center px-4 py-2 bg-default-100 text-small font-light flex flex-row flex-wrap justify-center gap-2">
              <p>
                © {year} {AUTHOR}
              </p>
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
