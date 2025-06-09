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

  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (refPre.current) {
      highlight.highlightElement(refPre.current);
      setIsHighlighted(true);
    }
  }, []);

  return (
    <Skeleton
      className={clsx("rounded-medium", className)}
      isLoaded={isHighlighted}
    >
      <pre
        ref={refPre}
        className={clsx(
          "py-4 px-6",
          "rounded-medium",
          "overflow-x-auto",
          "text-small"
        )}
      >
        {children}
      </pre>
      <ButtonCopy ref={refPre} />
    </Skeleton>
  );
}
