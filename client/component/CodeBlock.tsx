"use client";

import { Skeleton } from "@heroui/react";
import { useRef, useEffect, useState, ReactNode } from "react";
import clsx from "clsx";
import highlight from "highlight.js";

import ButtonCopy from "@/component/ButtonCopy";

export default function ({
  children,
  className,
}: Readonly<{
  children: ReactNode;
  className?: string;
}>) {
  const refPre = useRef<HTMLPreElement>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (refPre.current) {
      highlight.highlightElement(refPre.current);
      setIsMounted(true);
    }
  }, []);

  return (
    <Skeleton className="rounded-medium mb-4" isLoaded={isMounted}>
      <pre
        ref={refPre}
        className={clsx(
          "p-3",
          "rounded-medium w-full whitespace-break-spaces",
          className
        )}
      >
        {children}
      </pre>
      <ButtonCopy ref={refPre} />
    </Skeleton>
  );
}
