"use client";

import React from "react";
import { Spacer } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

export default function ({
  children,
  title,
  isLeaving,
  ...props
}: {
  title: string;
  isLeaving: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [content, setContent] = React.useState<string>("");

  React.useEffect(() => {
    const fetchContent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setContent(`Content for ${title}`);
    };

    fetchContent();
  }, [title]);

  return (
    <div
      {...props}
      className={clsx(props.className, "flex flex-col gap-2", "h-32")}
    >
      <Spacer y={2} />
      <AnimatePresence>
        {content && !isLeaving && (
          <motion.div
            key={title}
            className="w-full h-full rounded-lg"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", bounce: 0.15 }}
            exit={{ x: "-100%", opacity: 0 }}
          >
            <h4 className="text-xl font-bold">{title}</h4>
            <Spacer y={2} />
            <p className="text-normal font-normal text-default-400">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
