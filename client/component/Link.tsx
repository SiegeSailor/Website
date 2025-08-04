"use client";

import { ComponentProps, useEffect } from "react";
import { Link } from "@heroui/react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<typeof Link>) {
  const isExternal = props.href?.startsWith("http");

  const router = useRouter();

  useEffect(() => {
    if (!isExternal) router.prefetch(props.href as Route);
  }, [isExternal, props.href, router]);

  return (
    <Link
      color="foreground"
      isExternal={isExternal}
      showAnchorIcon={isExternal}
      target={isExternal ? "_blank" : "_self"}
      underline="always"
      {...props}
      rel={props.rel || (isExternal ? "noopener noreferrer" : undefined)}
      className={clsx(
        !props.color && "text-default-500 hover:text-default-400",
        "font-light",
        props.className
      )}
    />
  );
}
