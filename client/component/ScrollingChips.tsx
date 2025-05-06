"use client";

import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function ({
  rows,
  parentIdentifier,
}: {
  rows: { name: string; icon: React.ReactNode }[][];
  parentIdentifier?: string;
}) {
  const refContainerParent = React.useRef<HTMLDivElement>(null);

  const [widthParent, setWidthParent] = React.useState(0);

  React.useEffect(() => {
    if (refContainerParent.current) {
      setWidthParent(refContainerParent.current.offsetWidth);
    }
  }, [parentIdentifier]);

  return (
    <div ref={refContainerParent} className="w-full h-full flex flex-col gap-5">
      {rows.map((items, index) => {
        const isEven = index % 2 === 0;
        const speed = 40;

        const containerRef = React.useRef<HTMLDivElement>(null);
        const [widthRow, setWidthRow] = React.useState(0);

        React.useEffect(() => {
          if (containerRef.current) {
            const widthTotal = Array.from(containerRef.current.children).reduce(
              (accumulator, child) => {
                const childWidth = (child as HTMLElement).offsetWidth;
                return accumulator + childWidth;
              },
              0
            );
            setWidthRow(
              Math.max(widthTotal, refContainerParent.current?.offsetWidth || 0)
            );
          }
        }, []);

        const offset = 20;
        const xStart = isEven ? -widthRow - offset : widthParent + offset;
        const xEnd = isEven ? widthParent + offset : -widthRow - offset;

        return (
          <ScrollShadow
            key={index}
            className="w-full pointer-events-none cursor-none"
            orientation="horizontal"
            hideScrollBar
          >
            <motion.div
              ref={containerRef}
              key={widthRow}
              className={clsx(
                "flex gap-2 nowrap w-full",
                widthRow > 0 ? "opacity-100" : "opacity-0",
                "transition-opacity duration-1000 ease-in-out"
              )}
              animate={["scrolling", "visible"]}
              initial={{ x: xStart, opacity: 0 }}
              style={{ width: widthRow }}
              variants={{
                scrolling: {
                  x: xEnd,
                  transition: {
                    duration: widthRow / speed,
                    repeat: Infinity,
                    ease: "linear",
                  },
                },
                visible: {
                  opacity: 1,
                  transition: {
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                },
              }}
            >
              {items.map((item) => (
                <Chip
                  key={item.name}
                  className="px-2 py-1 text-default-700"
                  variant="flat"
                  startContent={item.icon}
                >
                  {item.name}
                </Chip>
              ))}
            </motion.div>
          </ScrollShadow>
        );
      })}
    </div>
  );
}
