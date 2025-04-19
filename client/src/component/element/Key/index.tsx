import React from "react";

import styles from "./index.module.scss";

export default function ({ text }: { text: string }) {
  return <span className={styles.key}>{text}</span>;
}
