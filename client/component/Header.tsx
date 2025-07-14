"use client";

import { SquareTerminalIcon } from "lucide-react";
import {
  Navbar,
  NavbarContent,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  Divider,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { generateTitle, getEntries } from "@/helper/utility";
import { ROUTE_TITLE } from "@/setting/site";
import Link from "@/component/Link";
import Search from "@/component/Search";
import ThemeSwitch from "@/component/ThemeSwitch";

export default function () {
  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(() => false);
    setIsLoading(() => false);
  }, [pathname]);

  const handlePress = () => {
    setIsLoading(() => true);
  };

  return (
    <Navbar
      className="border-b-1 border-default-300 border-opacity-60"
      disableAnimation
      isBordered
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
            <h1 className="text-xl font-light">{generateTitle()}</h1>
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

      <NavbarMenu>
        <div className="max-w-[880px] w-full mx-auto">
          <div className="sm:hidden mb-4">
            <Search />
          </div>
          {getEntries(ROUTE_TITLE).map(([route, title]) => {
            return (
              <NavbarMenuItem key={route}>
                <Link
                  color={pathname === route ? "primary" : "foreground"}
                  className="w-full"
                  href={route}
                  isDisabled={isLoading}
                  onPress={handlePress}
                  size="lg"
                  underline="none"
                >
                  {title}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
