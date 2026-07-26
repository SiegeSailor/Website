"use client";

import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";

import "@/styles/global.css";
import { globalFontRoboto, globalViewport } from "@/settings/heads";
import DivisionCenter from "@/components/DivisionCenter";
import Error from "@/app/error";
import Provider from "@/components/Provider";

// `metadata` and `viewport` don't work. They are manually inserted below in `<head />`.
//
// This is the one document that cannot read content/: it is a client component
// (it takes `reset`), and helpers/server/content.ts inlines every content file
// through require.context, so importing it here would ship contact.yaml to the
// browser. The last-resort error screen therefore carries its own literal title
// and no social metadata, which is what an uncrawlable error page wants anyway.
export const metadata: Metadata = { title: "Error" };

export const viewport: Viewport = globalViewport;

export default function ({
  error,
  reset,
}: Readonly<{ error: Error & { digest: string }; reset: () => void }>) {
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang="en">
      <head>
        <title>{metadata.title?.toString()}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="white"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="black"
        />
      </head>
      <body
        suppressHydrationWarning
        className={clsx(
          globalFontRoboto.className,
          "bg-danger-100 overscroll-none",
        )}
      >
        <Provider>
          <NextTopLoader
            color="hsl(var(--heroui-primary))"
            showSpinner={false}
          />

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
