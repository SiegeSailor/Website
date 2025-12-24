"use server";

import { SquareTerminalIcon } from "lucide-react";
import {
  NavbarContent,
  NavbarMenuToggle,
  NavbarItem,
  Divider,
} from "@heroui/react";

import Search from "@/components/Search";
import IconTheme from "@/components/IconTheme";

export default async function () {
  return (
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
        className="text-default-500/40 translate-y-px"
      />
      <IconTheme />
      <NavbarMenuToggle className="h-6" />
    </NavbarContent>
  );
}
