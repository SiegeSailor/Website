"use client";

import { useEffect, useRef, useId, useState } from "react";
import { Skeleton } from "@heroui/react";
import clsx from "clsx";
import mermaid from "mermaid";

// check ol li gaps
// create profile page
// mermaid charts in small screens

mermaid.initialize({
  theme: "neutral",
  themeCSS: `
    .gitBranchLabel0, .gitBranchLabel1, .gitBranchLabel2, .gitBranchLabel3,
    .gitBranchLabel4, .gitBranchLabel5, .gitBranchLabel6, .gitBranchLabel7 {
      font-size: 14px !important;
    }
    .commit-id, .commit-msg, .commit-label {
      font-size: 14px !important;
    }
    .tag-label {
      font-size: 14px !important;
    }
    path {
      stroke-width: 4px !important;
    }
    text {
      font-size: 14px !important;
    }
  `,
  fontFamily: "Roboto",
  fontSize: 14,
  gitGraph: {
    showBranches: true,
    showCommitLabel: true,
    parallelCommits: true,
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
        refMermaid.current.innerHTML = svg;
        console.log(svg);
        bindFunctions?.(refMermaid.current);
      }
    })();
  }, [source]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Skeleton isLoaded={isMounted} className={clsx("w-full", "rounded-md")}>
      <div className={clsx("bg-default-100 dark:bg-default-50", "rounded-md")}>
        <div
          id={identity}
          ref={refMermaid}
          className={clsx(
            "flex items-center justify-center",
            "h-96 w-full overflow-auto"
          )}
        />
      </div>
    </Skeleton>
  );
};
