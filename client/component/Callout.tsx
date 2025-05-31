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

const COLOR_ICON: Record<
  NonNullable<ComponentProps<typeof Code>["color"]>,
  ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
> = {
  danger: BadgeMinusIcon,
  default: BadgeHelpIcon,
  primary: BadgeInfoIcon,
  secondary: BadgeHelpIcon,
  success: BadgeCheckIcon,
  warning: BadgeAlertIcon,
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

const COLOR_COLOR: Record<
  NonNullable<ComponentProps<typeof Code>["color"]>,
  string
> = {
  danger: "bg-red-50 border-red-300",
  default: "bg-gray-50 border-gray-300",
  primary: "bg-blue-50 border-blue-300",
  secondary: "bg-gray-50 border-gray-300",
  success: "bg-green-50 border-green-300",
  warning: "bg-yellow-50 border-yellow-300",
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
        "rounded-md p-4",
        COLOR_COLOR[color],
        "border-2",
        className
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-start gap-2 mb-2",
          "text-xl font-semibold"
        )}
      >
        <div>
          {createElement(COLOR_ICON[color], {
            size: "1.45rem",
          })}
        </div>
        <div>{title ? title : COLOR_TITLE[color]}</div>
      </div>

      {children}
    </div>
  );
}
