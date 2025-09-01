"use client";

import { ComponentProps, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function ({ ...props }: ComponentProps<"div"> & Readonly<{}>) {
  const refContainer = useRef<HTMLDivElement>(null);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!refContainer.current) return;
      const rect = refContainer.current.getBoundingClientRect();
      setIsSticky(rect.top <= 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  return (
    <div
      ref={refContainer}
      {...props}
      className={clsx(
        "sticky h-fit top-4 overflow-y-auto transition-[max-height] duration-350",
        isSticky ? "max-h-[calc(100vh-2rem)]" : "max-h-[calc(100vh-12rem)]",
        props.className
      )}
    />
  );
}
