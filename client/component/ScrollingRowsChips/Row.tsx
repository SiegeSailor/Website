"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ScrollShadow, Chip } from "@heroui/react";
import clsx from "clsx";

const SPEED = 40 as const;

export default function ({
  isEven,
  row,
  widthParent,
}: Readonly<{
  isEven: boolean;
  row: { name: string; icon: ReactNode }[];
  widthParent: number;
}>) {
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
      setWidthRow(() => Math.max(widthTotal, widthParent));
    }
  }, []);

  const offset = 20;
  const xStart = isEven ? -widthRow - offset : widthParent + offset;
  const xEnd = isEven ? widthParent + offset : -widthRow - offset;

  return (
    <ScrollShadow
      className="w-full pointer-events-none cursor-none"
      orientation="horizontal"
      hideScrollBar
    >
      <motion.div
        ref={refRow}
        key={widthRow}
        className={clsx(
          "flex gap-2 nowrap w-full. transition-opacity duration-1000 ease-in-out",
          widthRow > 0 ? "opacity-100" : "opacity-0"
        )}
        animate={["scrolling", "visible"]}
        initial={{ x: xStart, opacity: 0 }}
        style={{ width: widthRow }}
        variants={{
          scrolling: {
            x: xEnd,
            transition: {
              duration: widthRow / SPEED,
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
        {row.map((item) => (
          <Chip
            key={item.name}
            className="px-2 py-1 text-default-700"
            variant="flat"
            startContent={item.icon}
            size="md"
          >
            {item.name}
          </Chip>
        ))}
      </motion.div>
    </ScrollShadow>
  );
}
