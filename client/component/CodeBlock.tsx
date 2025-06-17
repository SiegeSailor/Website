"use client";

import { Skeleton } from "@heroui/react";
import { useRef, useEffect, useState, ReactNode } from "react";
import clsx from "clsx";
import highlight from "highlight.js";

import ButtonCopy from "@/component/ButtonCopy";

function parse(content: string) {
  const lines = content.split("\n");

  const result: { lines: string[]; isHighlighted: boolean }[] = [];
  let buffer: string[] = [];
  let isInHighlight = false;

  for (const line of lines) {
    if (line.includes("highlight-start")) {
      if (buffer.length > 0) {
        result.push({ lines: buffer, isHighlighted: false });
        buffer = [];
      }
      isInHighlight = true;
      continue;
    }

    if (line.includes("highlight-end")) {
      if (buffer.length > 0) {
        result.push({ lines: buffer, isHighlighted: true });
        buffer = [];
      }
      isInHighlight = false;
      continue;
    }
    buffer.push(line);
  }

  if (buffer.length > 0)
    result.push({ lines: buffer, isHighlighted: isInHighlight });

  return result;
}

export default function ({
  children,
  className,
}: Readonly<{
  children: string;
  className?: string;
}>) {
  const refItems = useRef<(HTMLDivElement | null)[]>(null);

  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    if (refItems.current) {
      for (const item of refItems.current) {
        if (item === null) continue;
        highlight.highlightElement(item);
      }
      setIsHighlighted(true);
    }
  }, []);

  return (
    <Skeleton
      className={clsx("rounded-medium", className)}
      isLoaded={isHighlighted}
    >
      <pre
        className={clsx(
          "py-4",
          "rounded-medium",
          "overflow-x-auto",
          "text-small",
          "hljs language-stylus"
        )}
      >
        {parse(children).map((value, index) => {
          return (
            <div
              ref={(element) => {
                if (refItems.current === null) {
                  refItems.current = [];
                }
                refItems.current[index] = element;
              }}
              key={index}
              className={clsx(
                value.isHighlighted ? "bg-default-700" : "bg-transparent",
                "whitespace-pre px-6"
              )}
            >
              {value.lines.join("\n")}
            </div>
          );
        })}
      </pre>
      <ButtonCopy content={children} isDisabled={!isHighlighted} />
    </Skeleton>
  );
}
