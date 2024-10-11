import React from "react";
import clsx from "clsx";

import styles from "./styles.module.scss";

export default function Comments(
  props: React.ComponentProps<"button">
): JSX.Element {
  return <button {...props} className={clsx(props.className, styles.module)} />;
}
