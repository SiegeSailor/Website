"use client";

import { ReactNode, ComponentProps, createContext, useContext } from "react";
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "next-themes";
import { useRouter } from "next/navigation";

const defaultRootContextValues = {} as const;

const RootContext = createContext(defaultRootContextValues);

export function useRootContext() {
  return useContext(RootContext);
}

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
        <RootContext.Provider value={defaultRootContextValues}>
          {children}
        </RootContext.Provider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}
