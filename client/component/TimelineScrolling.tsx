"use client";

import { useEffect, useRef } from "react";
import { ScrollShadow } from "@heroui/react";
import clsx from "clsx";

export default function ({
  classNameHeight = "h-full",
  items,
  speedScroll = 2.5,
}: Readonly<{
  classNameHeight?: string;
  items: Readonly<{ title: string; time: string }[]>;
  speedScroll?: number;
}>) {
  const refContainer = useRef<HTMLDivElement>(null);
  const refContent = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (refContainer.current) {
      refContainer.current.classList.remove("opacity-0");
    }
  }, []);

  return (
    <ScrollShadow
      ref={refContainer}
      className={clsx(
        "w-full grow relative opacity-0 transition-opacity duration-2000 ease-in-out",
        classNameHeight
      )}
    >
      <ol
        ref={refContent}
        className="animate-scroll-timeline"
        style={{
          animationDuration: `${(items.length * 2) / speedScroll}s`,
        }}
      >
        {items.map((item) => (
          <li
            key={item.title}
            className="flex items-center relative pl-6 ml-4 border-l-1 pb-4 border-default-700"
          >
            <div className="translate-y-12">
              <div className="absolute top-1/2 z-10 -left-7 w-3 h-3 rounded-lg -translate-x-0.5 bg-default-700" />
              <div className="flex flex-col relative w-10/12">
                <p className="text-medium leading-5">{item.title}</p>
                <p className="text-small text-default-400">{item.time}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </ScrollShadow>
  );
}
