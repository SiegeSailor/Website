"use client";

import { ReactNode, ComponentProps } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

export default function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const push = useRouter().push as ComponentProps<
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
