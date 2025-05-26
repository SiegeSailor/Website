import { createElement } from "react";
import clsx from "clsx";

const LEVEL_TEXT: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-3xl",
  2: "text-2xl",
  3: "text-xl",
  4: "text-lg",
  5: "text-base",
  6: "text-sm",
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
      className: clsx(LEVEL_TEXT[level], "font-medium", props.className),
    },
    createElement("a", { href: `#${props.children}` }, props.children)
  );
}
