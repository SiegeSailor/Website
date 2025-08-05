"use server";

import { HTMLAttributes } from "react";
import { Spinner } from "@heroui/react";
import clsx from "clsx";

export default async function ({ ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(
        "w-full h-full",
        "flex justify-center items-center",
        props.className
      )}
    >
      <Spinner variant="simple" color="default" className="h-64 w-64" />
    </div>
  );
}
