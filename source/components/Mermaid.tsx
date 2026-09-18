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
          // Render at natural scale: 1 viewBox unit = 1 CSS pixel. Scaling to
          // the column width instead would give every diagram its own scale
          // factor, so node size, text and stroke width would differ chart to
          // chart. Mermaid sets its own `max-width`, so the style is replaced
          // outright rather than extended.
          const viewBox = element.getAttribute("viewBox");
          if (viewBox) {
            const [, , width, height] = viewBox.split(" ").map(Number);
            if (width && height) {
              element.setAttribute("width", String(width));
              element.setAttribute("height", String(height));
            }
          }
          element.setAttribute(
            "style",
            "max-width: none; display: block; margin: 0 auto;",
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
        <div className="relative h-96 w-full overflow-auto rounded-md bg-default-50 p-4 sm:p-6">
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
          <div
            className="flex min-h-full items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </Skeleton>

      <ZoomPanModal isOpen={isOpen} onClose={onClose} title="Diagram">
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </ZoomPanModal>
    </>
  );
}
