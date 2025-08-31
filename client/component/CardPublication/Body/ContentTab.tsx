"use client";

import { Spacer, ScrollShadow } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

import { PUBLICATION } from "@/setting/home";
import Link from "@/component/Link";

export default function ({
  item,
  isLeaving,
}: Readonly<{
  item: (typeof PUBLICATION)[number];
  isLeaving: boolean;
}>) {
  return (
    <div className="flex flex-col gap-2 h-40">
      <Spacer y={2} />
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
            <div className="flex flex-col gap-4 h-full">
              <div className="flex gap-2 sm:gap-1 md:gap-2 flex-wrap whitespace-nowrap">
                <h4 className="text-2xl sm:text-xl md:text-2xl font-medium">
                  {item.title}
                </h4>
                <Link href={item.href}>Read More</Link>
              </div>
              <ScrollShadow className="h-full sm:h-16 md:h-28">
                <p className="text-medium font-normal text-default-400">
                  {item.description}
                </p>
              </ScrollShadow>
              <Spacer y={1} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
