"use client";

import React from "react";
import { ScrollShadow } from "@heroui/react";

export default function ({
  items,
  ...props
}: React.ComponentProps<typeof ScrollShadow> & { items: React.ReactNode[] }) {
  const [indexItems, setIndexItems] = React.useState(8);
  return (
    <ScrollShadow
      onScroll={(event) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight) {
          setIndexItems((previous) => Math.min(previous + 4, items.length));
        }
      }}
      size={120}
      {...props}
    >
      {items.slice(0, indexItems).map((item, index) => (
        <React.Fragment key={index}>{item}</React.Fragment>
      ))}
    </ScrollShadow>
  );
}
