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
}: {
  category: "info" | "warning" | "note";
  children: React.ReactNode;
  className?: string;
}) {
  const setup = {
    title: category[0].toUpperCase() + category.slice(1),
    icon: <LuBadgeInfo size="1.25rem" className="text-gray-500" />,
    color: "",
    backgroundColor: "",
  };
  switch (category) {
    case "info":
      setup.title = "Information";
      setup.icon = <LuBadgeCheck size="1.25rem" className="text-green-500" />;
      break;
    case "warning":
      setup.title = "Warning";
      setup.icon = <LuBadgeAlert size="1.25rem" className="text-yellow-500" />;
      break;
    case "note":
      setup.title = "Note";
      setup.icon = <LuBadgeHelp size="1.25rem" className="text-blue-500" />;
      break;
    default:
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
        <div>{setup.title}</div>
      </div>

      {children}
    </div>
  );
}
