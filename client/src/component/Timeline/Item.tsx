import React from "react";
import clsx from "clsx";

export default function ({
  title,
  time,
}: {
  title: string;
  time: string;
  weight: number;
}) {
  return (
    <li
      className={clsx(
        "flex items-center relative pl-6 ml-4 border-l-1",
        "pb-4",
        "border-default-700"
      )}
    >
      <div className={clsx("translate-y-10")}>
        <div
          className={clsx(
            "absolute top-1/2 z-10 -left-7 w-3 h-3 rounded-lg",
            "-translate-x-0.5",
            "bg-default-700"
          )}
        />
        <div className={clsx("flex flex-col relative w-10/12")}>
          <p className={clsx("text-md sm:text-sm")}>{title}</p>
          <p className={clsx("text-sm sm:text-tiny text-default-400")}>
            {time}
          </p>
        </div>
      </div>
    </li>
  );
}
