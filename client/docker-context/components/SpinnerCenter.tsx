"use client";

import type { ComponentProps } from "react";
import { Spinner } from "@heroui/react";

import DivisionCenter from "@/components/DivisionCenter";

export default function ({ ...props }: ComponentProps<typeof DivisionCenter>) {
  return (
    <DivisionCenter {...props}>
      <Spinner variant="simple" color="default" className="h-64 w-64" />
      {props.children}
    </DivisionCenter>
  );
}
