import { createElement } from "react";
import { Link2Icon } from "lucide-react";
import type { Route } from "next";
import clsx from "clsx";

// Every level stays below the article title (1.7rem, medium) on the post page.
const LEVEL_TO_CLASSNAMES: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
  1: "text-[1.45rem] leading-snug font-medium tracking-tight",
  2: "text-xl leading-snug font-medium tracking-tight",
  3: "text-large font-medium",
  4: "text-medium font-semibold",
  5: "text-medium font-medium",
  6: "text-small font-semibold",
} as const;

export default async function ({
  level,
  href,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement> &
  Readonly<{ level: keyof typeof LEVEL_TO_CLASSNAMES; href?: Route }>) {
  return createElement(
    `h${level}`,
    {
      ...props,
      className: clsx(
        "font-light mb-4 last:mb-0 mt-12 first:mt-0 break-words",
        props.className,
      ),
    },
    <a
      href={href ?? `#${props.id}`}
      className={clsx(
        "hover:text-default-700 dark:hover:text-default-600",
        LEVEL_TO_CLASSNAMES[level],
      )}
    >
      <span className="pr-2">{props.children}</span>
      <Link2Icon className="inline" size="1rem" strokeWidth="0.1rem" />
    </a>,
  );
}
