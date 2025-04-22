"use client";

import React from "react";
import { link } from "@heroui/theme";
import { NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import { usePathname } from "next/navigation";
import * as next from "next";
import clsx from "clsx";
import NextLink from "next/link";

import Search from "@/component/Search";

const pages: { label: string; href: next.Route }[] = [
  { label: "Home", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Note", href: "/note" },
  { label: "Profile", href: "/profile" },
  { label: "Project", href: "/project" },
  { label: "Contact", href: "/contact" },
];

export default function () {
  const pathname = usePathname();
  return (
    <NavbarMenu>
      <Search />
      <div className="mx-4 mt-2 flex flex-col gap-2">
        {pages.map((item) => (
          <NavbarMenuItem key={item.label} isActive={pathname === item.href}>
            <NextLink
              className={clsx(
                link({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href={item.href}
            >
              {item.label}
            </NextLink>
          </NavbarMenuItem>
        ))}
      </div>
    </NavbarMenu>
  );
}
