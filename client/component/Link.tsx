import { ComponentProps } from "react";
import { Link } from "@heroui/react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<typeof Link>) {
  const isExternal = props.href?.startsWith("http");

  return (
    <Link
      color="foreground"
      download
      isExternal={isExternal}
      showAnchorIcon={isExternal}
      target={isExternal ? "_blank" : "_self"}
      underline="always"
      {...props}
      rel={props.rel || (isExternal ? "noopener noreferrer" : undefined)}
      className={clsx(
        !props.color && "text-default-500 hover:text-default-400",
        "font-light",
        props.className
      )}
    />
  );
}
