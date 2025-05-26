import React from "react";
import { Code } from "@heroui/react";
import clsx from "clsx";
import {
  LuBadgeAlert,
  LuBadgeCheck,
  LuBadgeHelp,
  LuBadgeInfo,
} from "react-icons/lu";

const COLOR_ICON: Record<
  NonNullable<React.ComponentProps<typeof Code>["color"]>,
  React.ReactNode
> = {
  danger: <LuBadgeAlert size="1.25rem" />,
  default: <LuBadgeInfo size="1.25rem" />,
  primary: <LuBadgeCheck size="1.25rem" />,
  secondary: <LuBadgeHelp size="1.25rem" />,
  success: <LuBadgeCheck size="1.25rem" />,
  warning: <LuBadgeAlert size="1.25rem" />,
};

const COLOR_TITLE: Record<
  NonNullable<React.ComponentProps<typeof Code>["color"]>,
  string
> = {
  danger: "Danger",
  default: "Note",
  primary: "Fact",
  secondary: "Note",
  success: "Success",
  warning: "Warning",
};

export default function ({
  color,
  children,
  className,
  title,
}: Readonly<{
  color: NonNullable<React.ComponentProps<typeof Code>["color"]>;
  children: React.ReactNode;
  className?: string;
  title: string;
}>) {
  return (
    <div
      className={clsx(
        "rounded-md p-3",
        "bg-background border-wa border-small",
        className
      )}
    >
      <div className={clsx("flex items-center justify-start gap-2 mb-2")}>
        <div>{COLOR_ICON[color]}</div>
        <div>{title ? title : COLOR_TITLE[color]}</div>
      </div>

      {children}
    </div>
  );
}
