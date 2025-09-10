"use client";

import { Skeleton } from "@heroui/react";
import { useEffect, useRef, useId, useState, ComponentProps } from "react";
import clsx from "clsx";
import mermaid from "mermaid";

import { useChartStore } from "@/store/chart";

export default ({
  source,
  ...props
}: ComponentProps<"div"> & Readonly<{ source: string }>) => {
  const refMermaid = useRef<HTMLDivElement>(null);

  const identity = useId();

  const countMermaidInitialize = useChartStore(
    (state) => state.countMermaidInitialize
  );

  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (refMermaid.current) {
      refMermaid.current.innerHTML = source;
      void mermaid
        .render(`mermaid-diagram-${identity}`, source)
        .then(({ svg, bindFunctions }) => {
          if (!refMermaid.current) return;

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

          refMermaid.current.innerHTML = `
          <div class="flex justify-center items-center min-h-128 px-72">
            <div class="inline-block py-16">
              ${element.outerHTML}
            </div>
          </div>`;
          bindFunctions?.(refMermaid.current);

          setTimeout(() => {
            if (refMermaid.current) {
              refMermaid.current.scrollLeft =
                (refMermaid.current.scrollWidth -
                  refMermaid.current.clientWidth) /
                2;
              refMermaid.current.scrollTop =
                (refMermaid.current.scrollHeight -
                  refMermaid.current.clientHeight) /
                2;
            }
            setIsRendered(true);
          }, 0);
        });
    }
  }, [source, identity, countMermaidInitialize]);

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
            "w-full rounded-md bg-default-50 h-128 min-h-128 overflow-auto",
            props.className
          )}
        />
      </figure>
    </Skeleton>
  );
};
