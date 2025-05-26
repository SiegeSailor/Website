"use client";

import { createContext, useContext, ReactNode } from "react";

export const defaultLayoutContextValues = {};
const Context = createContext(defaultLayoutContextValues);

export function useLayoutContext() {
  return useContext(Context);
}

export default function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <Context.Provider value={defaultLayoutContextValues}>
      {children}
    </Context.Provider>
  );
}
