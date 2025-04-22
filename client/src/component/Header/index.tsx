import React from "react";
import { RiAliensLine } from "react-icons/ri";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
} from "@heroui/navbar";
import NextLink from "next/link";

import ThemeSwitch from "@/component/ThemeSwitch";
import Search from "@/component/Search";
import Menu from "@/component/Header/Menu";
import { concatTitle } from "@/helper";

export default function () {
  return (
    <Navbar maxWidth="md" position="sticky">
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="start"
      >
        <Search />
      </NavbarContent>
      <NavbarContent className="basis-1/5 sm:basis-full" justify="center">
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
        <RiAliensLine className="text-default-500" size="1.25rem" />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <Menu />
    </Navbar>
  );
}
