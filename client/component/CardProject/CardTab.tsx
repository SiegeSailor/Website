"use client";

import { HTMLAttributes } from "react";
import { Spacer, ScrollShadow } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

import { PROJECT } from "@/setting/home";
import Link from "@/component/Link";

export default function ({
  children,
  item,
  isLeaving,
  ...props
}: HTMLAttributes<HTMLDivElement> &
  Readonly<{
    item: (typeof PROJECT)[number];
    isLeaving: boolean;
  }>) {
  return (
    <div
      {...props}
      className={clsx(props.className, "flex flex-col gap-2", "h-40")}
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
            <h4 className="text-2xl font-bold">{item.title}</h4>
            <Spacer y={2} />
            <ScrollShadow className="h-24" size={60}>
              <p className={clsx("text-lg font-normal text-default-400")}>
                {item.description}
              </p>
              <Spacer y={1} />
              <Link href={item.href} isExternal>
                Read More
              </Link>
            </ScrollShadow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
