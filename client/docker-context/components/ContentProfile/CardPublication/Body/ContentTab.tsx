"use client";

import type { ComponentProps } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollShadow } from "@heroui/react";
import clsx from "clsx";

import { PUBLICATION } from "@/settings/home";
import Link from "@/components/Link";

export default function ({
  item,
  isLeaving,
  ...props
}: ComponentProps<"div"> &
  Readonly<{
    item: (typeof PUBLICATION)[number];
    isLeaving: boolean;
  }>) {
  return (
    <div
      {...props}
      className={clsx("flex flex-col gap-2 h-40 pt-2", props.className)}
    >
      <AnimatePresence>
        {!isLeaving && (
          <motion.div
            key={item.title}
            className="w-full h-full rounded-lg"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.15 }}
            exit={{ x: "-100%", opacity: 0 }}
          >
            <div className="flex flex-row gap-4 w-full h-full mb-1">
              <div className="pb-2 w-1/2 md:w-1/3 flex flex-col gap-2 justify-between items-end">
                <ScrollShadow {...props} orientation="vertical">
                  <h4 className="text-xl sm:text-lg md:text-xl font-medium text-right">
                    {item.title}
                  </h4>
                </ScrollShadow>
                {!item.isDraft && <Link href={item.href}>Read More</Link>}
              </div>
              <ScrollShadow
                {...props}
                className={clsx(
                  "w-1/2 md:w-2/3 text-medium font-light text-foreground/50 h-full",
                  props.className
                )}
                orientation="vertical"
              >
                {item.description}
              </ScrollShadow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
