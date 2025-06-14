import { SquareTerminalIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Divider,
} from "@heroui/react";
import NextLink from "next/link";

import { generateTitle } from "@/helper/utility";
import Menu from "@/component/Header/Menu";
import Search from "@/component/Search";
import ThemeSwitch from "@/component/ThemeSwitch";

export default async function () {
  return (
    <Navbar position="sticky" maxWidth="md" className="shadow-sm">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-center items-center gap-1" href="/">
            <h1 className="text-xl font-light text-inherit">
              {generateTitle()}
            </h1>
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
        <SquareTerminalIcon
          size="1.45rem"
          className="text-default-500 text-opacity-disabled translate-y-px"
        />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>
      <Menu />
    </Navbar>
  );
}
