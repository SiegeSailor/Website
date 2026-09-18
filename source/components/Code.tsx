import { ComponentProps } from "react";
import { Code } from "@heroui/react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<typeof Code>) {
  return (
    <Code
      {...props}
      className={clsx(
        props.className,
        "py-[0.15rem]! px-[0.35rem]! bg-default-100! border border-default-200 text-foreground! inline whitespace-break-spaces break-all",
      )}
    />
  );
}
