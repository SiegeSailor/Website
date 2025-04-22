"use client";

import React from "react";

const defaultValues = {};
const Context = React.createContext(defaultValues);

export function useContext() {
  return React.useContext(Context);
}

export default function ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Context.Provider value={defaultValues}>{children}</Context.Provider>;
}
