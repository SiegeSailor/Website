"use client";

import { ComponentProps, useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { Button } from "@heroui/react";
import clsx from "clsx";

export default function ({
  content,
  ...props
}: ComponentProps<typeof Button> & Readonly<{ content: string }>) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      className={clsx(
        "absolute top-2 right-2",
        "text-default-500 hover:text-default-700",
        "dark:text-default-400 dark:hover:text-default-200"
      )}
      onPress={() => {
        navigator.clipboard.writeText(content);

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
    >
      {isCopied ? <CheckIcon size="1.25rem" /> : <CopyIcon size="1.25rem" />}
    </Button>
  );
}
