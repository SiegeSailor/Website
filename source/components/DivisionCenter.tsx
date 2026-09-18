import type { ComponentProps } from "react";
import clsx from "clsx";

export default function ({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 py-16 text-center",
        className,
      )}
      {...props}
    />
  );
}
