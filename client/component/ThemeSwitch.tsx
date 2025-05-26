"use client";

import { LuSun, LuMoon } from "react-icons/lu";
import { SwitchProps, useSwitch } from "@heroui/switch";
import { useIsSSR } from "@react-aria/ssr";
import { useTheme } from "next-themes";
import { VisuallyHidden } from "@react-aria/visually-hidden";
import clsx from "clsx";

export default function ({
  className,
  classNames,
}: Readonly<{
  className?: string;
  classNames?: SwitchProps["classNames"];
}>) {
  const { theme, setTheme } = useTheme();

  const isSSR = useIsSSR();

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === "light" || isSSR,
    "aria-label": `Switch to ${
      theme === "light" || isSSR ? "dark" : "light"
    } mode`,
    onChange: () => {
      theme === "light" ? setTheme("dark") : setTheme("light");
    },
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          "px-px transition-opacity hover:opacity-80 cursor-pointer",
          className,
          classNames?.base
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              "w-auto h-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "!text-default-500",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <LuSun size="1.45rem" />
        ) : (
          <LuMoon size="1.45rem" />
        )}
      </div>
    </Component>
  );
}
