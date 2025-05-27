import { ComponentProps } from "react";
import { Link } from "@heroui/react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      color="foreground"
      underline="always"
      showAnchorIcon={props.isExternal}
      {...props}
      className={clsx(
        "text-default-500 hover:text-default-400",
        props.className
      )}
    />
  );
}
