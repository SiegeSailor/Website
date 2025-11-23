"use client";

import { Skeleton } from "@heroui/react";
import {
  useLayoutEffect,
  useRef,
  useId,
  useState,
  ComponentProps,
} from "react";
import clsx from "clsx";
import mermaid from "mermaid";

import { useChartStore } from "@/store/chart";

export default ({
  source,
  ...props
}: ComponentProps<"div"> & Readonly<{ source: string }>) => {
  const refMermaid = useRef<HTMLDivElement>(null);

  const identity = useId();

  const [isRendered, setIsRendered] = useState(false);

  const refPreviousScroll = useRef<{ left: number | null; top: number | null }>(
    { left: null, top: null }
  );

  const colors = useChartStore((state) => state.colors);

  useLayoutEffect(() => {
    setIsRendered(false);

    requestAnimationFrame(() => {
      if (refMermaid.current) {
        refMermaid.current.innerHTML = source;
        void mermaid
          .render(`mermaid-diagram-${identity}`, source)
          .then(async ({ svg, bindFunctions }) => {
            if (!refMermaid.current) return;
            console.log("Rendered");
            const element = new DOMParser()
              .parseFromString(svg, "image/svg+xml")
              .querySelector("svg");
            if (!element) return;

            const viewBox = element.getAttribute("viewBox");
            if (!viewBox) return;

            const [x, y, width, height] = viewBox.split(" ").map(Number);
            element.setAttribute("width", width.toString());
            element.setAttribute("height", height.toString());
            element.setAttribute(
              "style",
              `width: ${width}px; height: ${height}px; display: block;`
            );

            refMermaid.current.innerHTML = element.outerHTML;
            bindFunctions?.(refMermaid.current);

            if (refMermaid.current) {
              if (
                refPreviousScroll.current.left === null ||
                refPreviousScroll.current.top === null
              ) {
                refPreviousScroll.current.left =
                  (refMermaid.current.scrollWidth -
                    refMermaid.current.clientWidth) /
                  2;
                refPreviousScroll.current.top =
                  (refMermaid.current.scrollHeight -
                    refMermaid.current.clientHeight) /
                  2;
              }

              refMermaid.current.scrollLeft = refPreviousScroll.current.left;
              refMermaid.current.scrollTop = refPreviousScroll.current.top;

              setIsRendered(true);
            }
          });
      }
    });
  }, [source, identity, colors]);

  return (
    <Skeleton
      {...props}
      isLoaded={isRendered}
      className={clsx("w-full rounded-md", props.className)}
    >
      <figure>
        <div
          {...props}
          id={identity}
          ref={refMermaid}
          className={clsx(
            "w-full rounded-md bg-default-50 overflow-auto py-16 px-36",
            props.className
          )}
          onScroll={() => {
            if (refMermaid.current && refPreviousScroll.current) {
              refPreviousScroll.current.left = refMermaid.current.scrollLeft;
              refPreviousScroll.current.top = refMermaid.current.scrollTop;
            }
          }}
        />
      </figure>
    </Skeleton>
  );
};
