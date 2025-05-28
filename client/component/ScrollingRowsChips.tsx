"use client";

import { Chip, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";
import { ReactNode, useRef, useState, useEffect } from "react";
import clsx from "clsx";

export default function ({
  rows,
  parentIdentifier,
}: Readonly<{
  rows: { name: string; icon: ReactNode }[][];
  parentIdentifier?: string;
}>) {
  const refContainer = useRef<HTMLDivElement>(null);

  const [widthParent, setWidthParent] = useState(0);

  useEffect(() => {
    if (refContainer.current) {
      setWidthParent(refContainer.current.offsetWidth);
    }
  }, [parentIdentifier]);

  return (
    <div ref={refContainer} className="w-full h-full flex flex-col gap-5">
      {rows.map((rows, index) => {
        const isEven = index % 2 === 0;
        const speed = 40;

        const refRow = useRef<HTMLDivElement>(null);
        const [widthRow, setWidthRow] = useState(0);

        useEffect(() => {
          if (refRow.current) {
            const widthTotal = Array.from(refRow.current.children).reduce(
              (accumulator, child) => {
                const childWidth = (child as HTMLElement).offsetWidth;
                return accumulator + childWidth;
              },
              0
            );
            setWidthRow(
              Math.max(widthTotal, refContainer.current?.offsetWidth || 0)
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
              ref={refRow}
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
              {rows.map((row) => (
                <Chip
                  key={row.name}
                  className="px-2 py-1 text-default-700"
                  variant="flat"
                  startContent={row.icon}
                  size="md"
                >
                  {row.name}
                </Chip>
              ))}
            </motion.div>
          </ScrollShadow>
        );
      })}
    </div>
  );
}
