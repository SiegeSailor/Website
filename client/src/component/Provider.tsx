"use client";

import React from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

export default async function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const push = useRouter().push as React.ComponentProps<
    typeof HeroUIProvider
  >["navigate"];

  return (
    <HeroUIProvider navigate={push}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </ThemeProvider>
    </HeroUIProvider>
  );
}
