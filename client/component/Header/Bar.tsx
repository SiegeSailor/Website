"use client";

import { ReactNode, useEffect } from "react";
import { Navbar } from "@heroui/react";

import { useHeaderStore } from "@/store/header";
import { useRoute } from "@/helper/client/history";

export default function ({ children }: Readonly<{ children: ReactNode }>) {
  const { isMenuOpen, setIsMenuOpen, hideMenu } = useHeaderStore();

  const { route } = useRoute();

  useEffect(() => {
    hideMenu();
  }, [route]);

  return (
    <Navbar
      disableAnimation
      isBlurred
      isBordered
      isMenuOpen={isMenuOpen}
      maxWidth="md"
      onMenuOpenChange={setIsMenuOpen}
      position="static"
    >
      {children}
    </Navbar>
  );
}
