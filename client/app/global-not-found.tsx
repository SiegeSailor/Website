"use server";

import { Alert, Button } from "@heroui/react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { createPageTitle } from "@/helper/utility";
import { DESCRIPTION, ROUTE_TITLE, TITLE, TITLE_ROUTE } from "@/setting/site";
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
        className={clsx(FontRoboto.className, "overscroll-none")}
      >
        <Provider>
          <div className="h-screen flex flex-col">
            <main className="container max-w-8xl mx-auto pt-4 sm:pt-8 px-4 grow">
              <div className="w-full flex items-center justify-center">
                <Alert
                  color="warning"
                  description={`This page couldn’t be found. Double-check the address or go back to the home page.`}
                  endContent={
                    <Link href={TITLE_ROUTE["Home"]} underline="none">
                      <Button color="warning" size="md" variant="solid">
                        {ROUTE_TITLE["/"]}
                      </Button>
                    </Link>
                  }
                  title={
                    <>
                      Not Found: <TextRoute />
                    </>
                  }
                  variant="faded"
                />
              </div>
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
