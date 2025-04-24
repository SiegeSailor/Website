import React from "react";
import { TerminalSquareIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Divider,
} from "@heroui/react";
import NextLink from "next/link";

import ThemeSwitch from "@/component/ThemeSwitch";
import Search from "@/component/Search";
import Menu from "@/component/Header/Menu";
import { concatTitle } from "@/helper";

export default function () {
  return (
    <Navbar maxWidth="md" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-center items-center gap-1" href="/">
            <h1 className="font-bold text-inherit">{concatTitle()}</h1>
          </NextLink>
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
        <TerminalSquareIcon className="text-default-500" />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <Menu />
    </Navbar>
  );
}
