import React from "react";
import clsx from "clsx";
import {
  LuBadgeAlert,
  LuBadgeCheck,
  LuBadgeHelp,
  LuBadgeInfo,
} from "react-icons/lu";

export default function ({
  category,
  children,
  className,
  title,
}: Readonly<{
  category: "info" | "warning" | "note";
  children: React.ReactNode;
  className?: string;
  title: string;
}>) {
  const setup = {
    icon: <LuBadgeInfo size="1.25rem" className="text-gray-500" />,
    color: "",
    backgroundColor: "",
  };
  switch (category) {
    case "info":
      setup.icon = <LuBadgeCheck size="1.25rem" className="text-green-500" />;
      break;
    case "warning":
      setup.icon = <LuBadgeAlert size="1.25rem" className="text-yellow-500" />;
      break;
    case "note":
      setup.icon = <LuBadgeHelp size="1.25rem" className="text-blue-500" />;
      break;
  }

  return (
    <div
      className={clsx(
        className,
        "bg-default-200 dark:bg-default-700 rounded-md px-4 py-2 mb-4"
      )}
    >
      <div className={clsx("flex gap-4 items-center")}>
        <div>{setup.icon}</div>
        <div>{title}</div>
      </div>

      {children}
    </div>
  );
}
