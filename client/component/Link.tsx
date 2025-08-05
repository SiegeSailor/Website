"use server";

import { ComponentProps } from "react";
import { Link } from "@heroui/react";
import clsx from "clsx";
import NextLink from "next/link";

export default async function ({
  isPlain,
  ...props
}: ComponentProps<typeof Link> & Readonly<{ isPlain?: boolean }>) {
  const isExternal = props.href?.startsWith("http");

  return (
    <Link
      as={NextLink}
      color="foreground"
      isExternal={isExternal}
      prefetch
      showAnchorIcon={isExternal}
      underline={isPlain ? "none" : "always"}
      {...props}
      className={clsx(
        !props.color && "text-default-500 hover:text-default-400",
        "font-light",
        isPlain ? "block" : "inline-flex",
        props.className
      )}
    />
  );
}
