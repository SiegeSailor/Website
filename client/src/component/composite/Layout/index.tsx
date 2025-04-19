import React from "react";

import styles from "./index.module.scss";

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
      <div className={styles.module}>
        <main className={styles.children}>{children}</main>
      </div>
    </Context.Provider>
  );
}
