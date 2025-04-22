import React from "react";
import * as next from "next";

import "@/style/global.css";
import Layout from "@/component/Layout";
import Provider from "@/component/Provider";

export const metadata: next.Metadata = {
  title: "Home | Jin Yu Zhang",
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
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
}
