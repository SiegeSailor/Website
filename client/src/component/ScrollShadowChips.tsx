"use client";

import React from "react";
import { Chip, ScrollShadow } from "@heroui/react";
import { motion } from "framer-motion";

export default function ({
  rows,
}: {
  rows: { name: string; icon: React.ReactNode }[][];
}) {
  return (
    <div className="w-64 h-64 flex flex-col gap-5">
      {rows.map((items, index) => {
        const isEven = index % 2 === 0;
        const widthRow = items.length * 100;
        const speed = 30;

        return (
          <ScrollShadow key={index} className="w-full" orientation="horizontal">
            <motion.div
              className="flex gap-2 nowrap"
              initial={{ x: isEven ? widthRow : -widthRow }}
              animate={{ x: isEven ? -widthRow : widthRow }}
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
