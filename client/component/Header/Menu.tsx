"use client";

import { NavbarMenu, NavbarMenuItem, Kbd, link, Button } from "@heroui/react";
import { Route } from "next";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Link from "@/component/Link";

import Search from "@/component/Search";

const PAGES: { label: string; href: Route; press: string }[] = [
  { label: "Home", href: "/", press: "H" },
  { label: "Blog", href: "/blog", press: "B" },
  { label: "Profile", href: "/profile", press: "P" },
] as const;

export default function () {
  const pathname = usePathname();

  return (
    <NavbarMenu>
      <div className="sm:hidden">
        <Search />
      </div>
      {PAGES.map((page) => {
        const isActive = pathname === page.href;
        return (
          <NavbarMenuItem key={page.label}>
            <Link
              href={page.href}
              color={isActive ? "primary" : undefined}
              size="lg"
              underline="none"
            >
              {page.label}
            </Link>
          </NavbarMenuItem>
        );
      })}
    </NavbarMenu>
  );
}
