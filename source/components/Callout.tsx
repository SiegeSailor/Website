import type {
  ComponentProps,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { createElement } from "react";
import { Code } from "@heroui/react";
import {
  BadgeAlertIcon,
  BadgeMinusIcon,
  BadgeCheckIcon,
  BadgeHelpIcon,
  BadgeInfoIcon,
  LucideProps,
} from "lucide-react";
import clsx from "clsx";

const TYPE_COLOR = {
  danger: "danger",
  fact: "primary",
  note: "secondary",
  success: "success",
  warning: "warning",
} satisfies Readonly<
  Record<string, NonNullable<ComponentProps<typeof Code>["color"]>>
>;

const COLOR_TO_ICON: Readonly<
  Record<
    NonNullable<ComponentProps<typeof Code>["color"]>,
    ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >
  >
> = {
  danger: BadgeMinusIcon,
  default: BadgeHelpIcon,
  primary: BadgeInfoIcon,
  secondary: BadgeHelpIcon,
  success: BadgeCheckIcon,
  warning: BadgeAlertIcon,
} as const;

const COLOR_TO_TITLE: Readonly<
  Record<NonNullable<ComponentProps<typeof Code>["color"]>, string>
> = {
  danger: "Danger",
  default: "Note",
  primary: "Fact",
  secondary: "Note",
  success: "Success",
  warning: "Warning",
} as const;

const COLOR_TO_FRAME: Readonly<
  Record<NonNullable<ComponentProps<typeof Code>["color"]>, string>
> = {
  danger: "bg-danger/10 border-danger/30",
  default: "bg-default-50 border-default-200",
  primary: "bg-success/10 border-success/30",
  secondary: "bg-default-50 border-default-200",
  success: "bg-success/10 border-success/30",
  warning: "bg-warning/10 border-warning/30",
} as const;

const COLOR_TO_COLOR: Readonly<
  Record<NonNullable<ComponentProps<typeof Code>["color"]>, string>
> = {
  danger: "text-danger",
  default: "text-default-500",
  primary: "text-success",
  secondary: "text-default-500",
  success: "text-success",
  warning: "text-warning",
} as const;

export default async function ({
  type,
  children,
  className,
  title,
}: Readonly<{
  type: keyof typeof TYPE_COLOR;
  children: ReactNode;
  className?: string;
  title?: string;
}>) {
  const color: NonNullable<ComponentProps<typeof Code>["color"]> =
    TYPE_COLOR[type] ?? "default";

  return (
    <div
      className={clsx(
        "rounded-md p-4 border-1",
        COLOR_TO_FRAME[color],
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 mb-2">
        {createElement(COLOR_TO_ICON[color], {
          size: "1.25rem",
          className: COLOR_TO_COLOR[color],
        })}
        <div className="font-semibold">{title || COLOR_TO_TITLE[color]}</div>
      </div>

      {children}
    </div>
  );
}
