import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";

import "@/styles/global.css";
import {
  createGlobalMetadata,
  globalFontRoboto,
  globalViewport,
} from "@/settings/heads";
import { getArticles } from "@/helpers/server/article";
import { getSite } from "@/helpers/server/content";
import { PublicEnv } from "@/helpers/utility";
import Entry from "@/components/Entry";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Provider from "@/components/Provider";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSite();
  return createGlobalMetadata(site);
}

export const viewport: Viewport = globalViewport;

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const articles = await getArticles();

  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(globalFontRoboto.className, "overscroll-none")}
      >
        <PublicEnv />

        <Provider>
          <NextTopLoader
            color="hsl(var(--heroui-primary))"
            showSpinner={false}
          />

          <Entry articles={articles}>
            <div className="min-h-screen flex flex-col w-full max-w-2xl mx-auto px-6">
              <Header />
              <main className="grow">{children}</main>
              <Footer />
            </div>
          </Entry>
        </Provider>
      </body>
    </html>
  );
}
