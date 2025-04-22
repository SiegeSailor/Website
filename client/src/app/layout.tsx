import React from "react";
import * as next from "next";

import "@/style/global.css";
import { ScrollShadow } from "@heroui/react";
import Header from "@/component/Header";
import Layout from "@/component/Layout";
import Provider from "@/component/Provider";
import { concatTitle } from "@/helper";

export const metadata: next.Metadata = {
  title: concatTitle(),
  description: [
    "Welcome to my personal website." +
      "I am a software engineer focused on full-stack development and DevOps." +
      "Explore my profile, project, blog, and note to learn more about me.",
  ].join(" "),
  icons: { icon: "/favicon.ico" },
};

export const viewport: next.Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Provider>
          <Header />
          <div className="relative flex flex-col h-screen">
            <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
              <ScrollShadow>
                <Layout>{children}</Layout>
              </ScrollShadow>
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
