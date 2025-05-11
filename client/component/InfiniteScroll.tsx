"use client";

import React from "react";
import { ScrollShadow } from "@heroui/react";

export default function ({ items }: { items: React.ReactNode[] }) {
  const [indexItems, setIndexItems] = React.useState(8);
  return (
    <ScrollShadow
      orientation="vertical"
      className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] p-4 h-3/4"
      size={120}
      onScroll={(event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight) {
          setIndexItems((previous) => Math.min(previous + 4, items.length));
        }
      }}
    >
      {items.slice(0, indexItems).map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </ScrollShadow>
  );
}
