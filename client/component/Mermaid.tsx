"use client";

import { useEffect, useRef, useId, useState } from "react";
import { Skeleton, ScrollShadow } from "@heroui/react";
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
    <Skeleton className={clsx("rounded-medium")} isLoaded={isMounted}>
      <ScrollShadow className={clsx("h-80 p-3", "bg-default-100")} size={120}>
        <div id={identity} ref={refMermaid} />
      </ScrollShadow>
    </Skeleton>
  );
};
