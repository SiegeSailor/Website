"use client";

import React from "react";
import { Skeleton } from "@heroui/react";
import clsx from "clsx";
import highlight from "highlight.js";

import ButtonCopy from "@/component/ButtonCopy";

export default function ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  className?: string;
}>) {
  const refPre = React.useRef<HTMLPreElement>(null);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    if (refPre.current) {
      highlight.highlightElement(refPre.current);
      setIsMounted(true);
    }
  }, []);

  return (
    <Skeleton className="rounded-medium mb-4" isLoaded={isMounted}>
      <pre
        ref={refPre}
        className={clsx("p-3", "rounded-medium w-full", className)}
      >
        {children}
      </pre>
      <ButtonCopy ref={refPre} />
    </Skeleton>
  );
}
