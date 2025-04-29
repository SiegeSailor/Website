"use client";

import React from "react";
import { NavbarMenu, NavbarMenuItem, Kbd, link, Button } from "@heroui/react";
import { usePathname } from "next/navigation";
import * as next from "next";
import clsx from "clsx";
import NextLink from "next/link";

import Search from "@/component/Search";

const pages: { label: string; href: next.Route; press: string }[] = [
  { label: "Home", href: "/", press: "H" },
  { label: "Blog", href: "/blog", press: "B" },
  { label: "Profile", href: "/profile", press: "P" },
  { label: "Project", href: "/project", press: "R" },
];

export default function () {
  const pathname = usePathname();
  return (
    <NavbarMenu>
      <div className="sm:hidden">
        <Search />
      </div>
      <div className="mt-2 flex flex-col gap-2 text-center">
        {pages.map((item) => {
          const isActive = pathname === item.href;
          return (
            <NavbarMenuItem key={item.label} isActive={isActive}>
              <NextLink href={item.href}>
                <Button
                  endContent={<Kbd keys={["command"]}>{item.press}</Kbd>}
                  size="md"
                  variant="light"
                  className="w-full md:w-6/12 lg:w-8/12"
                  color={isActive ? "primary" : "default"}
                >
                  <span
                    data-active={isActive}
                    className={clsx(
                      link({ color: "foreground" }),
                      "data-[active=true]:text-primary data-[active=true]:font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </Button>
              </NextLink>
            </NavbarMenuItem>
          );
        })}
      </div>
    </NavbarMenu>
  );
}
