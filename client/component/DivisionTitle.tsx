import { ComponentProps, ReactNode } from "react";
import clsx from "clsx";

export default function ({
  description,
  title,
  ...props
}: ComponentProps<"div"> &
  Readonly<{ description: ReactNode; title: ReactNode }>) {
  return (
    <div
      {...props}
      className={clsx(
        "w-full flex flex-col gap-2 max-w-compact mx-auto",
        props.className
      )}
    >
      <h4 className="text-2xl sm:text-3xl font-light text-default-600 w-full">
        {title}
      </h4>
      <p className="w-full text-medium text-foreground/50">{description}</p>
    </div>
  );
}
