"use client";

import type { ReactNode, ComponentProps } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

import { useColorTheme, useMermaid } from "@/helpers/client/chart";

function Initializer({ children }: Readonly<{ children: ReactNode }>) {
  useColorTheme();
  useMermaid();

  return children;
}

export default function ({ children }: Readonly<{ children: ReactNode }>) {
  const push = useRouter().push as ComponentProps<
    typeof HeroUIProvider
  >["navigate"];

  return (
    <HeroUIProvider navigate={push}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Initializer>{children}</Initializer>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
