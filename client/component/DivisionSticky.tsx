"use client";

import { ComponentProps } from "react";
import { ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { HEIGHT } from "@/component/Header/Bar";

const OFFSET = "2rem" as const;

export default function ({ ...props }: ComponentProps<"div">) {
  const height = `calc(100vh - ${HEIGHT} - ${OFFSET} * 4)`;

  return (
    <ScrollShadow
      {...props}
      className={clsx(
        "sticky h-full overflow-y-auto transition-[max-height] duration-250",
        props.className
      )}
      style={{
        maxHeight: height,
        top: `calc(${OFFSET} + ${HEIGHT})`,
      }}
    />
  );
}
