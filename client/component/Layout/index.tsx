"use client";

import { ReactNode } from "react";

import {
  defaultLayoutContextValues,
  LayoutContext,
} from "@/component/Layout/context";

export default function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <LayoutContext.Provider value={defaultLayoutContextValues}>
      {children}
    </LayoutContext.Provider>
  );
}
