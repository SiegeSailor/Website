import {
  NavbarContent,
  NavbarMenuToggle,
  NavbarItem,
  Divider,
} from "@heroui/react";

import IconTheme from "./IconTheme";
import Search from "./Search";
import Terminal from "./Terminal";

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
      <Terminal />
      <IconTheme />
      <NavbarMenuToggle className="h-6" />
    </NavbarContent>
  );
}
