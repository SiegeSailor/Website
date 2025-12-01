"use server";

import { createElement } from "react";
import { Link2Icon } from "lucide-react";
import { Route } from "next";
import clsx from "clsx";

const LEVEL_TO_CLASSNAMES: Readonly<Record<1 | 2 | 3 | 4 | 5 | 6, string>> = {
  1: "text-5xl leading-[1.25]",
  2: "text-4xl",
  3: "text-3xl",
  4: "text-2xl",
  5: "text-xl",
  6: "text-lg",
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
        LEVEL_TO_CLASSNAMES[level],
        props.className
      ),
    },
    <a
      href={href ?? `#${props.id}`}
      className="hover:text-default-700 dark:hover:text-default-600"
    >
      <span className="pr-2 font-normal">{props.children}</span>
      <Link2Icon className="inline" size="1rem" strokeWidth="0.1rem" />
    </a>
  );
}
