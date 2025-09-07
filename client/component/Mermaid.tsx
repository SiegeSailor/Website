"use client";

import { useEffect, useRef, useId, useState, ComponentProps } from "react";
import { Skeleton } from "@heroui/react";
import mermaid from "mermaid";
import clsx from "clsx";

mermaid.initialize({
  startOnLoad: true,
  theme: "null",
  themeVariables: {
    commitLabelFontSize: "1rem",
    fontFamily: "Roboto",
    fontSize: "1rem",
    tagLabelFontSize: "1rem",
  },
  themeCSS: `
    p, text, .commit-label, .tag-label {
      color: hsl(var(--heroui-default-700));
      fill: hsl(var(--heroui-default-700));
    }
    path {
      stroke-width: 2px !important;
      stroke: hsl(var(--heroui-foreground)) !important;
    }

    .commit-label, .tag-label {
      font-weight: 500;
    }
    .commit-label {
      transform: translateY(0.3125rem);
    }
    .commit-label-bkg {
      fill: hsl(var(--heroui-default-700) / 0.2) !important;
    }
    .tag-label {
      transform: translateY(0.125rem);
    }
    .tag-label-bkg {
      fill: hsl(var(--heroui-default-50)) !important;
      stroke: hsl(var(--heroui-default-700)) !important;
      stroke-width: 2px !important;
    }
    .branch {
      stroke: hsl(var(--heroui-default-700)) !important;
    }
    .branch-label0 text, .branch-label1 text, .branch-label2 text, .branch-label3 text {
      fill: hsl(var(--heroui-background)) !important;
    }
    .branchLabelBkg.label0, .commit0 {
      fill: hsl(var(--heroui-default-700)) !important;
      stroke: hsl(var(--heroui-default-700)) !important;
    }
    .branchLabelBkg.label1, .commit1 {
      fill: hsl(var(--heroui-default-600)) !important;
      stroke: hsl(var(--heroui-default-600)) !important;
    }
    .branchLabelBkg.label2, .commit2 {
      fill: hsl(var(--heroui-default-500)) !important;
      stroke: hsl(var(--heroui-default-500)) !important;
    }
    .branchLabelBkg.label3, .commit3 {
      fill: hsl(var(--heroui-default-400)) !important;
      stroke: hsl(var(--heroui-default-400)) !important;
    }
    .branchLabelBkg.label4, .commit4 {
      fill: hsl(var(--heroui-default-300)) !important;
      stroke: hsl(var(--heroui-default-300)) !important;
    }
    .branchLabelBkg.label5, .commit5 {
      fill: hsl(var(--heroui-default-200)) !important;
      stroke: hsl(var(--heroui-default-200)) !important;
    }

    .label-container path {
      fill: hsl(var(--heroui-default-700)) !important;
      stroke: hsl(var(--heroui-default-700)) !important;
    }
    .nodeLabel p {
      color: hsl(var(--heroui-background)) !important;
    }
  `,
  gitGraph: {
    showBranches: true,
    showCommitLabel: true,
    parallelCommits: true,
  },
  flowchart: {
    nodeSpacing: 25,
    rankSpacing: 50,
    curve: "basis",
  },
});

export default ({
  source,
  ...props
}: ComponentProps<"div"> & Readonly<{ source: string }>) => {
  const refMermaid = useRef<HTMLDivElement>(null);

  const identity = useId();

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
          }, 0);

          setIsRendered(true);
        });
    }
  }, [source, identity]);

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
