"use client";

import { useEffect, useRef, useId, useState } from "react";
import { Skeleton } from "@heroui/react";
import clsx from "clsx";
import mermaid from "mermaid";

const SCALE = 1 as const;
const ELEMENT_STYLE_WRAPPER =
  "display: flex; align-items: center; justify-content: center; min-height: 32rem; padding: 0 18rem;" as const;
const ELEMENT_STYLE_INNER = "display: inline-block; padding: 4rem 0;" as const;

mermaid.initialize({
  theme: "neutral",
  themeCSS: `
    .gitBranchLabel0, .gitBranchLabel1, .gitBranchLabel2, .gitBranchLabel3,
    .gitBranchLabel4, .gitBranchLabel5, .gitBranchLabel6, .gitBranchLabel7 {
      font-size: 16px !important;
      font-weight: 500 !important;
    }
    .commit-id, .commit-msg, .commit-label {
      font-size: 16px !important;
      font-weight: 500 !important;
    }
    .tag-label {
      font-size: 16px !important;
      font-weight: 500 !important;
    }
    .node rect, .node circle, .node ellipse, .node polygon {
      stroke-width: 2px !important;
    }
    path {
      stroke-width: 3px !important;
    }
    text {
      font-size: 16px !important;
      font-weight: 500 !important;
    }
    .flowchart-label {
      font-size: 16px !important;
      font-weight: 500 !important;
    }
    .edgeLabel {
      font-size: 14px !important;
    }
  `,
  fontFamily: "Roboto",
  fontSize: 16,
  gitGraph: {
    showBranches: true,
    showCommitLabel: true,
    parallelCommits: true,
  },
  flowchart: {
    nodeSpacing: 50,
    rankSpacing: 50,
    curve: "basis",
  },
});

export default ({ source }: { source: string }) => {
  const [isMounted, setIsMounted] = useState(false);

  const refMermaid = useRef<HTMLDivElement>(null);

  const identity = useId();

  useEffect(() => {
    (async () => {
      if (refMermaid.current) {
        refMermaid.current.innerHTML = source;
        const { svg, bindFunctions } = await mermaid.render(
          `mermaid-diagram-${identity}`,
          source
        );

        const element = new DOMParser()
          .parseFromString(svg, "image/svg+xml")
          .querySelector("svg");

        if (element) {
          element.removeAttribute("width");
          element.removeAttribute("height");

          const viewBox = element.getAttribute("viewBox");
          if (viewBox) {
            const [x, y, width, height] = viewBox.split(" ").map(Number);

            const widthScaled = width * SCALE;
            const heightScaled = height * SCALE;

            element.setAttribute("width", widthScaled.toString());
            element.setAttribute("height", heightScaled.toString());
            element.setAttribute(
              "style",
              `width: ${widthScaled}px; height: ${heightScaled}px; display: block;`
            );
          } else {
            element.setAttribute(
              "style",
              `transform: scale(${SCALE}); transform-origin: center; display: block;`
            );
          }

          refMermaid.current.innerHTML = `<div style="${ELEMENT_STYLE_WRAPPER}"><div style="${ELEMENT_STYLE_INNER}">${element.outerHTML}</div></div>`;
        } else {
          refMermaid.current.innerHTML = `<div style="${ELEMENT_STYLE_WRAPPER}"><div style="${ELEMENT_STYLE_INNER}">${svg}</div></div>`;
        }

        bindFunctions?.(refMermaid.current);
      }
    })();
  }, [source, identity]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Skeleton isLoaded={isMounted} className={clsx("w-full", "rounded-md")}>
      <div className={clsx("bg-default-100 dark:bg-default-50", "rounded-md")}>
        <div
          id={identity}
          ref={refMermaid}
          className={clsx("overflow-auto", "w-full h-128 min-h-128")}
        />
      </div>
    </Skeleton>
  );
};
