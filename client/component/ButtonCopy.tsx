"use client";

import React from "react";
import { LuCopy, LuCheck } from "react-icons/lu";
import { Button } from "@heroui/react";
import clsx from "clsx";

const ButtonCopy = React.forwardRef<
  HTMLPreElement,
  {
    title?: string;
  }
>(({ title = "Copy Code" }, ref) => {
  const [isCopied, setIsCopied] = React.useState(false);

  return (
    <Button
      className={clsx(
        "absolute top-2 right-2",
        "text-default-500 hover:text-default-700",
        "dark:text-default-400 dark:hover:text-default-200"
      )}
      onPress={() => {
        if (ref && "current" in ref && ref.current) {
          navigator.clipboard.writeText(ref.current.innerText);

          if (!isCopied) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
          }
        }
      }}
      title={title}
      isIconOnly
      size="sm"
      variant="light"
      radius="full"
    >
      {isCopied ? <LuCheck size="1.25rem" /> : <LuCopy size="1.25rem" />}
    </Button>
  );
});

ButtonCopy.displayName = "ButtonCopy";

export default ButtonCopy;
