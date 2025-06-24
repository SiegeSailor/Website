import {
  ComponentProps,
  createElement,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
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

const COLOR_ICON: Readonly<
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
};

const COLOR_TITLE: Readonly<
  Record<NonNullable<ComponentProps<typeof Code>["color"]>, string>
> = {
  danger: "Danger",
  default: "Note",
  primary: "Fact",
  secondary: "Note",
  success: "Success",
  warning: "Warning",
};

const COLOR_FRAME: Readonly<
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
};

const COLOR_COLOR: Readonly<
  Record<NonNullable<ComponentProps<typeof Code>["color"]>, string>
> = {
  danger: "text-red-500 dark:text-red-400",
  default: "text-gray-500 dark:text-gray-400",
  primary: "text-blue-500 dark:text-blue-400",
  secondary: "text-gray-500 dark:text-gray-400",
  success: "text-green-500 dark:text-green-400",
  warning: "text-orange-500 dark:text-orange-400",
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
  title?: string;
}>) {
  return (
    <div
      className={clsx(
        "rounded-md p-4",
        COLOR_FRAME[color],
        "border-1",
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-start gap-2 mb-2",
          "font-semibold"
        )}
      >
        {createElement(COLOR_ICON[color], {
          size: "1.25rem",
          className: COLOR_COLOR[color],
        })}
        <div>{title || COLOR_TITLE[color]}</div>
      </div>

      {children}
    </div>
  );
}
