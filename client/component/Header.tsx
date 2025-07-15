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
import { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import { generateTitle, getEntries } from "@/helper/utility";
import { getArticles } from "@/helper/article";
import { getProfile } from "@/helper/document";
import { ROUTE_TITLE } from "@/setting/site";
import Link from "@/component/Link";
import Search from "@/component/Search";
import ThemeSwitch from "@/component/ThemeSwitch";

export default function ({
  articles,
  profile,
}: Readonly<{
  articles: Awaited<ReturnType<typeof getArticles>>;
  profile: Awaited<ReturnType<typeof getProfile>>;
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(() => false);
    setIsLoading(() => false);
  }, [pathname]);

  const handlePress = (route: Route) => {
    if (route.split("#")[0] === pathname) {
      setIsOpen(() => false);
      return;
    }

    setIsLoading(() => true);
  };

  const items = useMemo(() => {
    const result: [Route, string, string?][] = [];
    getEntries(ROUTE_TITLE).forEach(([route, title]) => {
      result.push([route, title]);

      switch (route) {
        case "/blog":
          articles.forEach((article) => {
            result.push([
              `/blog/${article.metadata.date}` as Route,
              article.metadata.title,
              "pl-4",
            ]);
          });
          break;
        case "/profile":
          profile.metadata.anchors
            .filter((anchor) => anchor.level === 2)
            .forEach((anchor) => {
              result.push([
                `/profile#${anchor.identifier}` as Route,
                anchor.title,
                "pl-4",
              ]);
            });
          break;
        case "/":
        default:
          break;
      }
    });

    return result;
  }, [articles]);

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
        <div className={clsx("max-w-compact w-full mx-auto")}>
          <div className="sm:hidden mb-4">
            <Search />
          </div>
          {isMounted &&
            items.map(([route, title, className]) => {
              return (
                <NavbarMenuItem key={route}>
                  <Link
                    color={
                      `${pathname}${window.location.hash}` === route
                        ? "primary"
                        : "foreground"
                    }
                    className={clsx(
                      "w-full whitespace-normal",
                      "py-1 border-b-1",
                      "hover:!opacity-60",
                      className
                    )}
                    href={route}
                    isDisabled={isLoading}
                    onPress={() => handlePress(route)}
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
