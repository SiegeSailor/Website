"use server";

import { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { DESCRIPTION, TITLE } from "@/setting/site";
import Header from "@/component/Header";
import Provider from "@/component/Provider";

const FontRoboto = Roboto({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
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

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body
        suppressHydrationWarning
        className={clsx(FontRoboto.className, "overscroll-none")}
      >
        <Provider>
          <div className="h-screen flex flex-col">
            <Header />
            <main className="container max-w-8xl mx-auto pt-4 sm:pt-8 px-4 flex-grow">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
