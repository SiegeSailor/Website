"use client";

import { ComponentProps } from "react";
import { ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { HEIGHT } from "@/components/Header/Bar";

const OFFSET = "1.75rem" as const;

export default function ({ ...props }: ComponentProps<"div">) {
  return (
    <ScrollShadow
      {...props}
      className={clsx(
        "sticky h-full overflow-y-auto transition-[max-height] duration-250",
        props.className
      )}
      style={{
        maxHeight: `calc(100vh - ${HEIGHT} - ${OFFSET} * 4)`,
        top: `calc(${OFFSET} + ${HEIGHT})`,
      }}
    />
  );
}
