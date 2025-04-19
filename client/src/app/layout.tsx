import React from "react";
import * as next from "next";
import * as heroUI from "@heroui/react";

import "@/style/global.scss";
import Layout from "@/component/composite/Layout";

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
      <body>
        <heroUI.HeroUIProvider>
          <Layout>{children}</Layout>
        </heroUI.HeroUIProvider>
      </body>
    </html>
  );
}
