"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helpers/article";

type TAnchor = Pick<
  ReturnType<typeof getAnchorsByContent>[number],
  "identifier" | "level" | "title"
>;

// Matches `scroll-padding-top: 5rem` in styles/global.css, so the current
// section is the one a jump would land on.
const OFFSET = 80;

// The `<section id="comments">` that `Comments` renders on every article.
const COMMENTS: Omit<TAnchor, "level"> = {
  identifier: "comments",
  title: "Comments",
};

// Indexed by depth below the shallowest heading in the list.
const DEPTH_TO_PADDING = ["pl-3", "pl-6", "pl-9", "pl-12", "pl-15", "pl-18"];

function List({
  anchors,
  current,
}: Readonly<{ anchors: TAnchor[]; current?: string }>) {
  const shallowest = Math.min(...anchors.map((anchor) => anchor.level));

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
                DEPTH_TO_PADDING[anchor.level - shallowest],
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
  const sidebar = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState<string>();
  // "Comments" sits at the shallowest level present, so it is never indented.
  const entries = useMemo(() => {
    const level = Math.min(...anchors.map((anchor) => anchor.level), 6);
    return [...anchors, { ...COMMENTS, level } as TAnchor];
  }, [anchors]);

  useEffect(() => {
    const headings = entries
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
  }, [entries]);

  // A long list scrolls inside the sidebar, so keep the current entry in it.
  // Setting `scrollTop` directly, because `scrollIntoView` would also stop the
  // page's own smooth scroll after a jump.
  useEffect(() => {
    const element = sidebar.current;
    const link = element?.querySelector<HTMLElement>("[aria-current]");
    if (!element) return;
    if (!link) {
      element.scrollTop = 0;
      return;
    }
    const isAbove = link.offsetTop < element.scrollTop;
    const isBelow =
      link.offsetTop + link.offsetHeight >
      element.scrollTop + element.clientHeight;
    if (isAbove || isBelow)
      element.scrollTop = link.offsetTop - element.clientHeight / 2;
  }, [current]);

  return (
    <>
      <nav
        ref={sidebar}
        aria-label="On this page"
        className="hidden xl:flex flex-col gap-3 fixed top-28 left-[calc(50%+23rem)] w-52 max-h-[calc(100vh-9rem)] overflow-y-auto"
      >
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-default-500">
          On this page
        </span>
        <List anchors={entries} current={current} />
        <a
          href="#top"
          className="font-mono text-tiny text-default-500 hover:text-foreground transition-colors"
        >
          ↑ Back to top
        </a>
      </nav>

      <details className="xl:hidden mt-6 rounded-medium border border-default-200">
        <summary className="cursor-pointer px-3 py-2 font-mono text-tiny uppercase tracking-wider text-default-500">
          On this page · {entries.length}
        </summary>
        <div className="px-3 pb-3">
          <List anchors={entries} current={current} />
        </div>
      </details>
    </>
  );
}
