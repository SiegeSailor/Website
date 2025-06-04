import { createElement } from "react";
import clsx from "clsx";

const LEVEL_TEXT: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-4xl",
  2: "text-3xl",
  3: "text-2xl",
  4: "text-xl",
  5: "text-lg",
  6: "text-medium",
} as const;

export default function ({
  level,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> &
  Readonly<{ level: keyof typeof LEVEL_TEXT }>) {
  return createElement(
    `h${level}`,
    {
      ...props,
      className: clsx(
        LEVEL_TEXT[level],
        "font-light",
        "mb-4 last:mb-0 mt-16 first:mt-0",
        props.className
      ),
    },
    createElement("a", { href: `#${props.id}` }, props.children)
  );
}
