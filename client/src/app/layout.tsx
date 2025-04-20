import React from "react";
import * as next from "next";
import * as heroUI from "@heroui/react";

import "@/style/global.css";
import Layout from "@/component/Layout";

export const metadata: next.Metadata = {
  title: "Home | Jin Yu Zhang",
};

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <heroUI.HeroUIProvider>
          <Layout>{children}</Layout>
        </heroUI.HeroUIProvider>
      </body>
    </html>
  );
}
