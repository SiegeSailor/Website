"use client";

import { ComponentProps } from "react";
import { Image } from "@heroui/react";

export default function ({ ...props }: ComponentProps<typeof Image>) {
  return (
    <Image
      className="z-0 w-full h-full object-cover brightness-50 contrast-100 grayscale"
      loading="eager"
      removeWrapper
      {...props}
    />
  );
}
