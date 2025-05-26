import { ComponentProps } from "react";
import clsx from "clsx";
import { Link } from "@heroui/react";

export default function ({ ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      color="foreground"
      {...props}
      className={clsx(
        "text-default-500 hover:text-default-400",
        props.className
      )}
    />
  );
}
