import { Alert, Button } from "@heroui/react";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";

import "@/styles/global.css";
import {
  createGlobalMetadata,
  globalFontRoboto,
  globalViewport,
} from "@/settings/heads";
import { createPageTitle } from "@/helpers/utility";
import { getSite } from "@/helpers/server/content";
import { ROUTE_HOME } from "@/settings/constant";
import DivisionCenter from "@/components/DivisionCenter";
import Link from "@/components/Link";
import Provider from "@/components/Provider";
import TextRoute from "@/components/TextRoute";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSite();
  return {
    ...createGlobalMetadata(site),
    title: createPageTitle(site.title, "Not Found"),
  };
}

export const viewport: Viewport = globalViewport;

export default function () {
  return (
    <html data-scroll-behavior="smooth" suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(
          globalFontRoboto.className,
          "bg-warning-100 overscroll-none",
        )}
      >
        <Provider>
          <NextTopLoader
            color="hsl(var(--heroui-primary))"
            showSpinner={false}
          />

          <main className="h-screen mx-auto px-4">
            <DivisionCenter>
              <Alert
                color="warning"
                classNames={{ title: "font-medium" }}
                description={`This page couldn’t be found. Double-check the address or go back to the home page.`}
                title={
                  <>
                    Not Found: <TextRoute />
                  </>
                }
                variant="faded"
              >
                <div className="flex gap-2 mt-2">
                  <Link href={ROUTE_HOME} underline="none">
                    <Button color="warning" size="md" variant="solid">
                      {"Home"}
                    </Button>
                  </Link>
                </div>
              </Alert>
            </DivisionCenter>
          </main>
        </Provider>
      </body>
    </html>
  );
}
