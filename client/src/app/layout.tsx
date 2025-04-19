import React from "react";
import * as next from "next";
import * as nextThemes from "next-themes";

import "@/style/reset.scss";
import "@/style/font.scss";
import "@/style/global.scss";

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
          {children}
        </nextThemes.ThemeProvider>
      </body>
    </html>
  );
}
