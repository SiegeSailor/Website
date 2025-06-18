"use client";

import { useRef, useEffect, useState } from "react";
import { Skeleton } from "@heroui/react";
import clsx from "clsx";
import highlight from "highlight.js";

import { getKeys, getValues } from "@/helper/utility";
import ButtonCopy from "@/component/ButtonCopy";

const LEVEL_CLASSNAMES: { [key in "error" | "highlight"]: string } = {
  error: "bg-red-900/50",
  highlight: "bg-default-700 dark:bg-default-300/50",
} as const;

function parse(content: string) {
  const lines = content.split("\n");

  const result: {
    lines: string[];
    level?: keyof typeof LEVEL_CLASSNAMES;
  }[] = [];
  let buffer: string[] = [];

  const state: {
    [key in "within" | "next"]: {
      [key in keyof typeof LEVEL_CLASSNAMES]: boolean;
    };
  } = {
    within: { error: false, highlight: false },
    next: { error: false, highlight: false },
  };

  for (const line of lines) {
    getKeys(LEVEL_CLASSNAMES).forEach((level) => {
      if (line.includes(`${level}-start`)) {
        if (buffer.length > 0) {
          result.push({ lines: buffer });
          buffer = [];
        }
        state.within[level] = true;
        return;
      }

      if (line.includes(`${level}-end`)) {
        if (buffer.length > 0) {
          result.push({ lines: buffer, level });
          buffer = [];
        }
        state.within[level] = false;
        return;
      }

      if (line.includes(`${level}-next-line`)) {
        state.next[level] = true;
        return;
      }

      if (state.next[level]) {
        result.push({ lines: [line], level });
        state.next[level] = false;
        return;
      }
    });

    buffer.push(line);
  }

  if (buffer.length > 0) {
    result.push({
      lines: buffer,
      level: getKeys(LEVEL_CLASSNAMES).find((key) =>
        getValues(state).some((values) => values[key])
      ),
    });
  }

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
                value.level ? LEVEL_CLASSNAMES[value.level] : "bg-transparent",
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
