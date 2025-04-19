import React from "react";

import styles from "./index.module.scss";

export default function ({
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return <input {...props} type="text" className={styles.input} />;
}
