import { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import clsx from "clsx";

import "@/style/global.css";
import { generateTitle } from "@/helper/utility";
import Header from "@/component/Header";
import Provider from "@/component/Provider";

export const metadata: Metadata = {
  title: generateTitle(),
  description: [
    "Welcome to my personal website.",
    "I am a software engineer focused on full-stack development and DevOps.",
    "Explore my profile, project, blog, and note to learn more about me.",
  ].join(" "),
  icons: { icon: "/image/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const FontRoboto = Roboto({ subsets: ["latin"] });

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
