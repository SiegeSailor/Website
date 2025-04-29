"use client";

import React from "react";

export default function ({
  items,
}: {
  items: { title: string; time: string }[];
}) {
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down">(
    "down"
  );

  const refContainer = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
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
    }, 40000);

    return () => clearInterval(interval);
  }, [scrollDirection]);

  return (
    <div ref={refContainer} className="h-64 overflow-hidden relative">
      <ol className="pb-6">
        {items.map((item, index) => {
          const level = Math.min(700, (index + 1) * 100);
          const opacity = Math.min(
            100,
            (level + 100) / 10 + (70 - items.length * 10)
          );
          return (
            <li
              className={`h-14 flex items-center relative pl-4 ml-2 border-l-2 border-default-${level}`}
              key={item.title}
            >
              <div
                className={`absolute top-0 z-10 -left-1 w-3 h-3 bg-default-${level} rounded-lg translate-y-6`}
              />
              <div className={`flex flex-col translate-y-6 opacity-${opacity}`}>
                <p className="text-sm text-nowrap">{item.title}</p>
                <p className="text-tiny text-nowrap text-default-400">
                  {level} {opacity} {item.time}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
