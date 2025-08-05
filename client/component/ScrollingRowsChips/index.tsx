"use client";

import { ReactNode, useRef, useState, useEffect, useCallback } from "react";

import Row from "@/component/ScrollingRowsChips/Row";

export default function ({
  rows,
}: Readonly<{ rows: { name: string; icon: ReactNode }[][] }>) {
  const refContainer = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);

  const handleUpdateWidth = useCallback(() => {
    if (refContainer.current) {
      const current = refContainer.current.offsetWidth;
      setWidth(() => current);
    }
  }, []);

  useEffect(() => {
    handleUpdateWidth();

    window.addEventListener("resize", handleUpdateWidth);

    return () => window.removeEventListener("resize", handleUpdateWidth);
  }, [handleUpdateWidth]);

  return (
    <div ref={refContainer} className="w-full h-full flex flex-col gap-5">
      {rows.map((row, index) => {
        const isEven = index % 2 === 0;

        return (
          <Row isEven={isEven} key={index} row={row} widthParent={width} />
        );
      })}
    </div>
  );
}
