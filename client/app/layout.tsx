import { ReactNode } from "react";
import { Roboto } from "next/font/google";
import { Viewport, Metadata } from "next";
import "highlight.js/styles/atom-one-dark.css";

import "@/style/global.css";
import { generateTitle } from "@/helper/utility";
import { ScrollShadow } from "@heroui/react";
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

export default function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body suppressHydrationWarning className={FontRoboto.className}>
        <Provider>
          <Header />
          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-8xl py-8 px-4">
              <ScrollShadow className="h-full w-full">
                {children}
              </ScrollShadow>
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
