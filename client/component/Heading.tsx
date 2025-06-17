import { createElement } from "react";
import { Link2Icon } from "lucide-react";
import clsx from "clsx";

const LEVEL_CLASSNAMES: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-6xl leading-[1.05]",
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
  Readonly<{ level: keyof typeof LEVEL_CLASSNAMES }>) {
  return createElement(
    `h${level}`,
    {
      ...props,
      className: clsx(
        LEVEL_CLASSNAMES[level],
        "font-light",
        "mb-4 last:mb-0 mt-12 first:mt-0",
        props.className
      ),
    },
    <a href={`#${props.id}`} className="hover:text-default-500">
      <span className="pr-2">{props.children}</span>
      <Link2Icon className="inline" size="1rem" strokeWidth="0.1rem" />
    </a>
  );
}
