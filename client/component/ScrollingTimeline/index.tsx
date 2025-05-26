"use client";

import { ComponentProps, useState, useRef, useEffect } from "react";
import clsx from "clsx";

import Item from "@/component/ScrollingTimeline/Item";

export default function ({
  items,
  speedScroll = 30,
}: Readonly<{
  items: Readonly<Pick<ComponentProps<typeof Item>, "title" | "time">[]>;
  speedScroll?: number;
}>) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refContainer.current) {
      refContainer.current.classList.remove("opacity-0");
    }

    const interval = setInterval(() => {
      if (refContainer.current) {
        const container = refContainer.current;
        if (scrollDirection === "down") {
          container.scrollTop += 1;
          if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight
          ) {
            setScrollDirection("up");
          }
        } else {
          container.scrollTop -= 1;
          if (container.scrollTop <= 0) {
            setScrollDirection("down");
          }
        }
      }
    }, speedScroll);

    return () => clearInterval(interval);
  }, [scrollDirection, speedScroll]);

  return (
    <div
      ref={refContainer}
      className={clsx(
        "w-full h-full relative",
        "overflow-hidden relative",
        "opacity-0 transition-opacity duration-1000 ease-in-out"
      )}
    >
      <ol className="pb-16">
        {items.map((item, index) => (
          <Item
            key={item.title}
            {...item}
            weight={index + 1 + Math.max(0, 9 - items.length)}
          />
        ))}
      </ol>
    </div>
  );
}
