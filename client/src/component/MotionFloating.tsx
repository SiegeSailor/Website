import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

export default function ({
  children,
  className,
  volume = 6.5,
  duration = 1.5,
  ...props
}: HTMLMotionProps<"div"> & { volume?: number; duration?: number }) {
  return (
    <motion.div
      animate={["floating"]}
      initial={{ y: -volume }}
      variants={{
        floating: {
          y: [-volume, volume],
          opacity: 1,
          transition: {
            duration: duration,
            repeat: Infinity,
            repeatType: "reverse",
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
