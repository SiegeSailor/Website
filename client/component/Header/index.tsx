"use client";

import { SquareTerminalIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Divider,
} from "@heroui/react";
import { useState } from "react";

import { generateTitle } from "@/helper/utility";
import { getArticles } from "@/helper/server/article";
import { getProfile } from "@/helper/server/document";
import Link from "@/component/Link";
import Menu from "@/component/Header/Menu";
import Search from "@/component/Search";
import ThemeSwitch from "@/component/ThemeSwitch";

const TITLE = generateTitle();

export default function ({
  articles,
  profile,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
  profile: Awaited<ReturnType<typeof getProfile>>;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar
      className="border-b-1 border-default-300 border-opacity-60"
      disableAnimation
      isBordered
      isBlurred={false}
      isMenuOpen={isOpen}
      maxWidth="md"
      onMenuOpenChange={setIsOpen}
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <Link
            className="flex justify-center items-center gap-1"
            href="/"
            underline="none"
          >
            <h1 className="text-xl font-light">{TITLE}</h1>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="basis-1/5 sm:basis-full align-middle"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex">
          <Search />
        </NavbarItem>
        <Divider orientation="vertical" className="hidden sm:flex h-6" />
        <SquareTerminalIcon
          size="1.45rem"
          className="text-default-500 text-opacity-disabled translate-y-px"
        />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <Menu articles={articles} profile={profile} setIsOpen={setIsOpen} />
    </Navbar>
  );
}
