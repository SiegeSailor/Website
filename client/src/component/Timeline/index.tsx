"use client";

import React from "react";

import Item from "@/component/Timeline/Item";

export default function ({
  height = 64,
  items,
  speedScroll = 40,
}: {
  height?: number;
  items: Pick<React.ComponentProps<typeof Item>, "title" | "time">[];
  speedScroll?: number;
}) {
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">(
    "up"
  );

  const refContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = refContainer.current;

    if (container) {
      container.scrollTop = container.scrollHeight - container.clientHeight;
      container.classList.remove("opacity-0");
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
      className={`h-${height} overflow-hidden relative opacity-0 transition-opacity duration-500`}
    >
      <ol className="pb-6">
        {items.map((item, index) => (
          <Item key={item.title} {...item} weight={index + 1} />
        ))}
      </ol>
    </div>
  );
}
