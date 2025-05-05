"use client";

import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import { motion, useAnimate } from "framer-motion";
import clsx from "clsx";

export default function ({
  rows,
}: {
  rows: { name: string; icon: React.ReactNode }[][];
}) {
  const refContainerParent = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={refContainerParent} className="w-full h-full flex flex-col gap-5">
      {rows.map((items, index) => {
        const isEven = index % 2 === 0;
        const speed = 40;

        // const containerRef = React.useRef<HTMLDivElement>(null);
        const [scope, animate] = useAnimate<HTMLDivElement>();
        const [widthRow, setWidthRow] = React.useState(0);
        // console.log("animate", animate);

        React.useEffect(() => {
          if (scope.current) {
            const widthTotal = Array.from(scope.current.children).reduce(
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
        }, [items]);

        return (
          <ScrollShadow
            key={index}
            className="w-full pointer-events-none cursor-none"
            orientation="horizontal"
            hideScrollBar
          >
            <motion.div
              ref={scope}
              key={widthRow}
              className={clsx(
                "flex gap-2 nowrap w-full",
                widthRow > 0 ? "opacity-100" : "opacity-0",
                "transition-opacity duration-1000 ease-in-out"
              )}
              initial={{ x: isEven ? -widthRow : widthRow }}
              animate={{ x: isEven ? widthRow : -widthRow }}
              transition={{
                duration: widthRow / speed,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{ width: widthRow }}
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
