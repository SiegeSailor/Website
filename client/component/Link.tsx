import { ComponentProps } from "react";
import { Link } from "@heroui/react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<typeof Link>) {
  const isExternal = props.href?.startsWith("http");

  return (
    <Link
      color="foreground"
      underline="always"
      showAnchorIcon={isExternal}
      isExternal={isExternal}
      target={isExternal ? "_blank" : "_self"}
      {...props}
      className={clsx(
        "text-default-500 hover:text-default-400",
        "font-light",
        props.className
      )}
    />
  );
}
