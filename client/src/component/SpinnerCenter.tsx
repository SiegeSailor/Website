import React from "react";
import { Spinner } from "@heroui/react";
import clsx from "clsx";

export default function ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "w-full h-full",
        "flex justify-center items-center"
      )}
    >
      <Spinner variant="simple" color="default" className="h-64 w-64" />
    </div>
  );
}
