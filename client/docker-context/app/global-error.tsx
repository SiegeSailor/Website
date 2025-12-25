"use client";

import { Metadata } from "next";
import clsx from "clsx";

import "@/styles/global.css";
import {
  globalFontRoboto,
  globalMetadata,
  globalViewport,
} from "@/settings/head";
import { createPageTitle } from "@/helpers/utility";
import DivisionCenter from "@/components/DivisionCenter";
import Error from "./error";
import Provider from "@/components/Provider";

export const metadata: Metadata = {
  ...globalMetadata,
  title: createPageTitle("Error"),
};

export const viewport = globalViewport;

export default function ({
  error,
  reset,
}: Readonly<{ error: Error & { digest: string }; reset: () => void }>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(
          globalFontRoboto.className,
          "bg-danger-100 overscroll-none"
        )}
      >
        <Provider>
          <main className="h-screen mx-auto px-4">
            <DivisionCenter>
              Global
              <Error error={error} reset={reset} />
            </DivisionCenter>
          </main>
        </Provider>
      </body>
    </html>
  );
}
