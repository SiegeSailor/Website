"use client";

import { createContext, useContext } from "react";

export const defaultLayoutContextValues = {} as const;

export const LayoutContext = createContext(defaultLayoutContextValues);

export function useLayoutContext() {
  return useContext(LayoutContext);
}
