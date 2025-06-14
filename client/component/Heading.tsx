import { createElement } from "react";
import { Link2Icon } from "lucide-react";
import clsx from "clsx";

const LEVEL_TEXT: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-6xl",
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
      className: clsx(
        LEVEL_TEXT[level],
        "font-light",
        "mb-4 last:mb-0 mt-16 first:mt-0",
        "hover:text-default-500",
        props.className
      ),
    },
    <a href={`#${props.id}`}>
      <span className="pr-2">{props.children}</span>
      <Link2Icon className="inline" size="1rem" strokeWidth="0.1rem" />
    </a>
  );
}
