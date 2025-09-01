"use client";

import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { createPageTitle } from "@/helper/utility";
import { DESCRIPTION } from "@/setting/site";
import Error from "./error";
import Provider from "@/component/Provider";

const FontRoboto = Roboto({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: createPageTitle("Error"),
  description: DESCRIPTION,
  icons: { icon: "/image/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function ({
  error,
  reset,
}: Readonly<{ error: Error & { digest: string }; reset: () => void }>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(FontRoboto.className, "overscroll-none")}
      >
        <Provider>
          <div className="h-screen flex flex-col">
            <main className="container max-w-8xl mx-auto pt-4 sm:pt-8 px-4 grow">
              <div className="w-full flex items-center justify-center">
                <Error error={error} reset={reset} />
              </div>
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
