"use client";

import type { ComponentProps } from "react";
import { Spinner } from "@heroui/react";

import DivisionCenter from "@/components/DivisionCenter";

export default function ({ ...props }: ComponentProps<typeof DivisionCenter>) {
  return (
    <DivisionCenter {...props}>
      {/* `className` lands on the base slot, not the svg, so sizing has to go
          through `classNames.wrapper` — and for `simple` it also overrides the
          `size` prop's dimensions. */}
      <Spinner
        variant="simple"
        color="default"
        classNames={{ wrapper: "h-8 w-8" }}
      />
      {props.children}
    </DivisionCenter>
  );
}
