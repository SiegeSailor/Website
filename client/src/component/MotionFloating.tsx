import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

export default function ({
  children,
  className,
  volume = 6.5,
  duration = 1.5,
  direction,
  ...props
}: HTMLMotionProps<"div"> & {
  volume?: number;
  duration?: number;
  direction: "horizontal" | "vertical";
}) {
  const keyDirection: any = direction === "horizontal" ? "x" : "y";
  return (
    <motion.div
      animate={["floating", "visible"]}
      initial={{ [keyDirection]: 0, opacity: 0 }}
      variants={{
        floating: {
          [keyDirection]: [-volume, volume],
          transition: {
            duration: duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          },
        },
        visible: {
          opacity: 1,
          transition: {
            duration: duration,
            ease: "easeInOut",
          },
        },
      }}
      {...props}
      className={clsx(className)}
    >
      {children}
    </motion.div>
  );
}
