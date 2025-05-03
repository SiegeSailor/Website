"use client";

import React from "react";
import { Spacer } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { home } from "@/setting";

export default function ({
  children,
  item,
  isLeaving,
  ...props
}: {
  item: (typeof home)["project"][number];
  isLeaving: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={clsx(props.className, "flex flex-col gap-2", "h-32")}
    >
      <Spacer y={2} />
      <AnimatePresence>
        {item.description && !isLeaving && (
          <motion.div
            key={item.title}
            className="w-full h-full rounded-lg"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.15 }}
            exit={{ x: "-100%", opacity: 0 }}
          >
            <h4 className="text-xl font-bold">{item.title}</h4>
            <Spacer y={2} />
            <p className="text-normal font-normal text-default-400">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
