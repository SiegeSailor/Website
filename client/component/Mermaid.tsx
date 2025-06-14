"use client";

import { useEffect, useRef, useId, useState } from "react";
import { Skeleton } from "@heroui/react";
import clsx from "clsx";
import mermaid from "mermaid";

mermaid.initialize({ theme: "neutral" });

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
        bindFunctions?.(refMermaid.current);
      }
    })();
  }, [source]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <Skeleton isLoaded={isMounted} className={clsx("rounded-md")}>
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
