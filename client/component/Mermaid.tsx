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
              `width: ${width}px; height: ${height}px; display: block; margin: 0 auto;`
            );

            refMermaid.current.innerHTML = element.outerHTML;
            bindFunctions?.(refMermaid.current);

            refMermaid.current.scrollLeft =
              (refMermaid.current.scrollWidth -
                refMermaid.current.clientWidth) /
              2;

            setIsRendered(true);
          });
      }
    });
  }, [source, identity, colors]);

  return (
    <Skeleton
      {...props}
      isLoaded={isRendered}
      className={clsx(
        "w-full rounded-md border-1 border-default-200",
        props.className
      )}
    >
      <div
        {...props}
        id={identity}
        ref={refMermaid}
        className={clsx(
          "w-full rounded-md bg-default-50 overflow-x-auto py-16 px-36 mx-auto scroll-auto!",
          props.className
        )}
      />
    </Skeleton>
  );
};
