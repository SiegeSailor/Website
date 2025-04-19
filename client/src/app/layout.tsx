import React from "react";
import * as next from "next";
import * as nextThemes from "next-themes";

import "@/style/reset.scss";
import "@/style/font.scss";
import "@/style/theme.scss";
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
      <body suppressHydrationWarning>
        <nextThemes.ThemeProvider
          disableTransitionOnChange
          attribute="data-theme"
          defaultTheme="light"
          themes={["light", "dark"]}
        >
          <Layout>{children}</Layout>
        </nextThemes.ThemeProvider>
      </body>
    </html>
  );
}
