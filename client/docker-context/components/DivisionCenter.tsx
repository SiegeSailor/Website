"use client";

import type { ComponentProps } from "react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        "w-full h-full flex justify-center items-center",
        props.className
      )}
    />
  );
}
