"use client";

import { useState, useRef, useEffect } from "react";

export default function ({
  items,
  speedScroll = 30,
}: Readonly<{
  items: Readonly<{ title: string; time: string }[]>;
  speedScroll?: number;
}>) {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  const refContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (refContainer.current)
      refContainer.current.classList.remove("opacity-0");

    const interval = setInterval(() => {
      if (refContainer.current) {
        const container = refContainer.current;
        if (scrollDirection === "down") {
          container.scrollTop += 1;
          if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight
          ) {
            setScrollDirection(() => "up");
          }
        } else {
          container.scrollTop -= 1;
          if (container.scrollTop <= 0) {
            setScrollDirection(() => "down");
          }
        }
      }
    }, speedScroll);

    return () => clearInterval(interval);
  }, [scrollDirection, speedScroll]);

  return (
    <div
      ref={refContainer}
      className="w-full h-full relative overflow-hidden opacity-0 transition-opacity duration-1000 ease-in-out"
    >
      <ol className="pb-16">
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
    </div>
  );
}
