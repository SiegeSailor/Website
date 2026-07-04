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
  danger: "bg-red-50 border-red-300 dark:bg-red-950 dark:border-red-700",
  default: "bg-gray-50 border-gray-300 dark:bg-gray-950 dark:border-gray-700",
  primary: "bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700",
  secondary: "bg-gray-50 border-gray-300 dark:bg-gray-950 dark:border-gray-700",
  success:
    "bg-green-50 border-green-300 dark:bg-green-950 dark:border-green-700",
  warning:
    "bg-orange-50 border-orange-300 dark:bg-orange-950 dark:border-orange-700",
} as const;

const COLOR_TO_COLOR: Readonly<
  Record<NonNullable<ComponentProps<typeof Code>["color"]>, string>
> = {
  danger: "text-red-500 dark:text-red-400",
  default: "text-gray-500 dark:text-gray-400",
  primary: "text-blue-500 dark:text-blue-400",
  secondary: "text-gray-500 dark:text-gray-400",
  success: "text-green-500 dark:text-green-400",
  warning: "text-orange-500 dark:text-orange-400",
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
