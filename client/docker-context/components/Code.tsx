import type { ComponentProps } from "react";
import { Code } from "@heroui/react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<typeof Code>) {
  return (
    <Code
      {...props}
      className={clsx(props.className, "py-[0.05rem] bg-gray-700!")}
    />
  );
}
