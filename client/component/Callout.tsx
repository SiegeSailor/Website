import { ComponentProps, ReactNode } from "react";
import { Code } from "@heroui/react";
import clsx from "clsx";
import {
  LuBadgeAlert,
  LuBadgeMinus,
  LuBadgeCheck,
  LuBadgeHelp,
  LuBadgeInfo,
} from "react-icons/lu";

const COLOR_ICON: Record<
  NonNullable<ComponentProps<typeof Code>["color"]>,
  ReactNode
> = {
  danger: <LuBadgeMinus size="1.45rem" />,
  default: <LuBadgeHelp size="1.45rem" />,
  primary: <LuBadgeInfo size="1.45rem" />,
  secondary: <LuBadgeHelp size="1.45rem" />,
  success: <LuBadgeCheck size="1.45rem" />,
  warning: <LuBadgeAlert size="1.45rem" />,
};

const COLOR_TITLE: Record<
  NonNullable<ComponentProps<typeof Code>["color"]>,
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
  color: NonNullable<ComponentProps<typeof Code>["color"]>;
  children: ReactNode;
  className?: string;
  title: string;
}>) {
  return (
    <div
      className={clsx(
        "rounded-md p-3",
        "bg-background border-wa border-2",
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
