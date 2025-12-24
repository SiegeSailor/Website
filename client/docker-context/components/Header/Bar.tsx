"use client";

import { ReactNode, useEffect } from "react";
import { Navbar } from "@heroui/react";

import { useHeaderStore } from "@/stores/header";
import { useRoute } from "@/helpers/client/history";

export const HEIGHT = "4rem" as const;

export default function ({ children }: Readonly<{ children: ReactNode }>) {
  const { isMenuOpen, setIsMenuOpen, hideMenu } = useHeaderStore();

  const { route } = useRoute();

  useEffect(() => {
    hideMenu();
  }, [route]);

  return (
    <Navbar
      disableAnimation
      disableScrollHandler
      height={HEIGHT}
      isBlurred={false}
      isBordered
      isMenuOpen={isMenuOpen}
      maxWidth="md"
      onMenuOpenChange={setIsMenuOpen}
      style={{ position: "fixed" }}
    >
      {children}
    </Navbar>
  );
}
