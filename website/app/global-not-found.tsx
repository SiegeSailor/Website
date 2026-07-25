import { Alert, Button } from "@heroui/react";
import type { Metadata, Viewport } from "next";
import clsx from "clsx";
import NextTopLoader from "nextjs-toploader";

import "@/styles/global.css";
import {
  globalFontRoboto,
  globalMetadata,
  globalViewport,
} from "@/settings/heads";
import { createPageTitle } from "@/helpers/utility";
import { ROUTE_TO_TITLE, TITLE_TO_ROUTE } from "@/settings/constant";
import DivisionCenter from "@/components/DivisionCenter";
import Link from "@/components/Link";
import Provider from "@/components/Provider";
import TextRoute from "@/components/TextRoute";

export const metadata: Metadata = {
  ...globalMetadata,
  title: createPageTitle("Not Found"),
};

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
                  <Link href={TITLE_TO_ROUTE["Home"]} underline="none">
                    <Button color="warning" size="md" variant="solid">
                      {ROUTE_TO_TITLE["/"]}
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
