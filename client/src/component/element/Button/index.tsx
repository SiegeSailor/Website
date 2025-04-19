import React from "react";

import styles from "./index.module.scss";

export default function ({
  format,
  icon,
  size,
  text,
  ...props
}: {
  format: "solid" | "outline";
  icon?: React.ReactNode;
  size: "large" | "medium" | "small";
  text?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) {
  return (
    <button
      {...props}
      data-format={format}
      data-size={size}
      className={styles.button}
    >
      {icon && <span>{icon}</span>}
      {text && <p>{text}</p>}
    </button>
  );
}
