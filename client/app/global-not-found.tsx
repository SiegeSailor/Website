"use server";

import { Alert, Button } from "@heroui/react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { createPageTitle } from "@/helper/utility";
import { DESCRIPTION, ROUTE_TITLE, TITLE_ROUTE } from "@/setting/site";
import DivisionCenter from "@/component/DivisionCenter";
import Link from "@/component/Link";
import Provider from "@/component/Provider";
import TextRoute from "@/component/TextRoute";

const FontRoboto = Roboto({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: createPageTitle("Not Found"),
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

export default async function () {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(FontRoboto.className, "bg-warning-100 overscroll-none")}
      >
        <Provider>
          <main className="h-screen container max-w-8xl mx-auto px-4">
            <DivisionCenter>
              <Alert
                color="warning"
                classNames={{ title: "font-medium!" }}
                description={`This page couldn’t be found. Double-check the address or go back to the home page.`}
                title={
                  <>
                    Not Found: <TextRoute />
                  </>
                }
                variant="faded"
              >
                <div className="flex gap-2 mt-2">
                  <Link href={TITLE_ROUTE["Home"]} underline="none">
                    <Button color="warning" size="md" variant="solid">
                      {ROUTE_TITLE["/"]}
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
