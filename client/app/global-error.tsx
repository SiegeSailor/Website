"use client";

import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { createPageTitle } from "@/helper/utility";
import { DESCRIPTION } from "@/setting/constant";
import DivisionCenter from "@/component/DivisionCenter";
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
        className={clsx(FontRoboto.className, "bg-danger-100 overscroll-none")}
      >
        <Provider>
          <main className="h-screen mx-auto px-4">
            <DivisionCenter>
              <Error error={error} reset={reset} />
            </DivisionCenter>
          </main>
        </Provider>
      </body>
    </html>
  );
}
