import React from "react";
import clsx from "clsx";

export default function ({
  title,
  time,
  weight,
}: {
  title: string;
  time: string;
  weight: number;
}) {
  weight = Math.min(9, weight);

  const level = Math.min(900, weight * 100);
  const opacity = Math.min(100, weight * 10 + 10);

  return (
    <li
      className={clsx(
        "flex items-center relative pl-4 ml-2 border-l-2",
        "pb-4",
        `border-default-${level}`
      )}
    >
      <div
        className={clsx(
          "absolute top-0 z-10 -left-1 w-3 h-3 rounded-lg",
          "translate-y-12",
          `bg-default-${level}`
        )}
      />
      <div
        className={clsx(
          "flex flex-col",
          "translate-y-12",
          `opacity-${opacity}`
        )}
      >
        <p className="text-md sm:text-sm">{title}</p>
        <p className="text-sm sm:text-tiny text-default-400">{time}</p>
      </div>
    </li>
  );
}
