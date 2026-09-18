"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Skeleton, Button, useDisclosure } from "@heroui/react";
import { Maximize2Icon } from "lucide-react";
import clsx from "clsx";
import mermaid from "mermaid";

import { useChartStore } from "@/stores/chart";
import ZoomPanModal from "@/components/ZoomPanModal";

// A module-level counter guarantees a unique id per render, so React Strict
// Mode's double-invoke (dev) and re-renders never collide on the same mermaid id.
let sequence = 0;

const escapeHtml = (value: string) =>
  value.replace(/[<&]/g, (character) => (character === "<" ? "&lt;" : "&amp;"));

export default function Mermaid({
  source,
  ...props
}: ComponentProps<"div"> & Readonly<{ source: string }>) {
  const [svg, setSvg] = useState("");
  const [isRendered, setIsRendered] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const colors = useChartStore((state) => state.colors);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-diagram-${(sequence += 1)}`;

    (async () => {
      try {
        const { svg: rendered } = await mermaid.render(id, source);
        if (cancelled) return;

        const element = new DOMParser()
          .parseFromString(rendered, "image/svg+xml")
          .querySelector("svg");

        if (element) {
          // Fit to the column width for a consistent size; pin an explicit
          // aspect-ratio from the viewBox so the height is deterministic
          // (bare `height: auto` collapses to 150px in some engines).
          const viewBox = element.getAttribute("viewBox");
          let aspect = "";
          if (viewBox) {
            const [, , width, height] = viewBox.split(" ").map(Number);
            if (width && height) {
              element.setAttribute("width", String(width));
              element.setAttribute("height", String(height));
              aspect = ` aspect-ratio: ${width} / ${height};`;
            }
          }
          element.setAttribute(
            "style",
            `width: 100%; height: auto; max-width: 100%; display: block; margin: 0 auto;${aspect}`,
          );
          setSvg(element.outerHTML);
        }
      } catch {
        // Never leave the skeleton spinning — show the source as a fallback.
        setSvg(
          `<pre class="text-tiny overflow-x-auto p-2">${escapeHtml(source)}</pre>`,
        );
      } finally {
        if (!cancelled) setIsRendered(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [source, colors]);

  return (
    <>
      <Skeleton
        isLoaded={isRendered}
        className={clsx("w-full rounded-md bg-default-50", props.className)}
      >
        <div className="relative w-full rounded-md bg-default-50 p-4 sm:p-6 overflow-x-auto">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            onPress={onOpen}
            aria-label="Enlarge diagram"
            className="absolute top-2 right-2 z-10 bg-background/70 backdrop-blur-sm"
          >
            <Maximize2Icon size="1rem" />
          </Button>
          <div className="w-full" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
      </Skeleton>

      <ZoomPanModal isOpen={isOpen} onClose={onClose} title="Diagram">
        <div
          className="w-full [&>svg]:max-h-[70vh]!"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </ZoomPanModal>
    </>
  );
}
