"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helpers/article";

type TAnchor = Pick<
  ReturnType<typeof getAnchorsByContent>[number],
  "identifier" | "level" | "title"
>;

// Matches `scroll-padding-top: 5rem` in styles/global.css, so the current
// section is the one a jump would land on.
const OFFSET = 80;
const MINIMUM = 3;

function List({
  anchors,
  current,
}: Readonly<{ anchors: TAnchor[]; current?: string }>) {
  return (
    <ol className="border-l border-default-200 text-small">
      {anchors.map((anchor) => {
        const isCurrent = anchor.identifier === current;

        return (
          <li key={anchor.identifier}>
            <a
              href={`#${anchor.identifier}`}
              aria-current={isCurrent ? "location" : undefined}
              className={clsx(
                "block -ml-px border-l py-1 pr-1 leading-snug transition-colors",
                anchor.level === 3 ? "pl-6" : "pl-3",
                isCurrent
                  ? "border-primary text-foreground"
                  : "border-transparent text-default-500 hover:text-foreground",
              )}
            >
              {anchor.title}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function ({ anchors }: Readonly<{ anchors: TAnchor[] }>) {
  const [current, setCurrent] = useState<string>();

  useEffect(() => {
    const headings = anchors
      .map((anchor) => document.getElementById(anchor.identifier))
      .filter((heading) => heading !== null);

    const update = () => {
      const passed = headings.filter(
        (heading) => heading.getBoundingClientRect().top <= OFFSET + 1,
      );
      // The last sections cannot scroll up to the line, so at the end of the
      // page a followed link that is still below it wins.
      const target = headings.find(
        (heading) => `#${heading.id}` === decodeURI(window.location.hash),
      );
      const top = target?.getBoundingClientRect().top ?? 0;
      const isAtEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 1;
      setCurrent(
        isAtEnd && top > OFFSET + 1 && top < window.innerHeight
          ? target?.id
          : passed.at(-1)?.id,
      );
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("hashchange", update);
    };
  }, [anchors]);

  if (anchors.length < MINIMUM) return null;

  return (
    <>
      <nav
        aria-label="On this page"
        className="hidden xl:flex flex-col gap-3 fixed top-28 left-[calc(50%+23rem)] w-52 max-h-[calc(100vh-9rem)] overflow-y-auto"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-default-500">
          On this page
        </span>
        <List anchors={anchors} current={current} />
        <a
          href="#top"
          className="font-mono text-tiny text-default-500 hover:text-foreground transition-colors"
        >
          ↑ Back to top
        </a>
      </nav>

      <details className="xl:hidden mt-6 rounded-medium border border-default-200">
        <summary className="cursor-pointer px-3 py-2 font-mono text-tiny uppercase tracking-wider text-default-500">
          On this page · {anchors.length}
        </summary>
        <div className="px-3 pb-3">
          <List anchors={anchors} current={current} />
        </div>
      </details>
    </>
  );
}
