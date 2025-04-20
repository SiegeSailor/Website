"use client";

import React from "react";

import styles from "./index.module.scss";
import Search from "@/component/Search";

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
  return (
    <Context.Provider value={defaultValues}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Jin Yu Zhang</h1>
          </div>
          <div>
            <Search />
          </div>
        </header>

        <main className={styles.children}>{children}</main>
      </div>
    </Context.Provider>
  );
}
