"use client";

import type { ComponentProps } from "react";
import { isValidElement, useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@heroui/react";
import clsx from "clsx";

function parseContentRecursively(children: any): string {
  if (typeof children === "string") return children;
  if (Array.isArray(children))
    return children.map(parseContentRecursively).join("");
  if (isValidElement(children))
    return parseContentRecursively((children.props as Element).children);

  return "";
}

export default function ({
  content,
  ...props
}: ComponentProps<typeof Button> & Readonly<{ content: any }>) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      onPress={() => {
        navigator.clipboard.writeText(parseContentRecursively(content));

        if (!isCopied) {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        }
      }}
      isIconOnly
      size="sm"
      variant="light"
      radius="full"
      {...props}
      className={clsx(
        "text-default-500 hover:text-default-700 dark:text-default-400 dark:hover:text-default-200",
        props.className
      )}
    >
      {isCopied ? <CheckIcon size="1.25rem" /> : <CopyIcon size="1.25rem" />}
    </Button>
  );
}
