"use client";

import type { ReactNode, ComponentProps } from "react";
import { useState, Fragment } from "react";
import { ScrollShadow } from "@heroui/react";

export default function ({
  items,
  indexInitial,
  ...props
}: ComponentProps<typeof ScrollShadow> &
  Readonly<{ items: ReactNode[]; indexInitial: number }>) {
  const [indexItems, setIndexItems] = useState(indexInitial);

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
        <Fragment key={index}>{item}</Fragment>
      ))}
    </ScrollShadow>
  );
}
