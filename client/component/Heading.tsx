import { createElement } from "react";
import clsx from "clsx";

const LEVEL_TEXT: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-5xl",
  2: "text-4xl",
  3: "text-3xl",
  4: "text-2xl",
  5: "text-xl",
  6: "text-lg",
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
    createElement("a", { href: `#${props.id}` }, props.children)
  );
}
