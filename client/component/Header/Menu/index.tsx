"use client";

import { NavbarMenu, NavbarMenuItem, ScrollShadow } from "@heroui/react";

import { useHeaderStore } from "@/store/header";
import Search from "@/component/Search";

import CardArticles from "./CardArticles";
import CardPages from "./CardPages";
import CardProfile from "./CardProfile";
import CardProjects from "./CardProjects";

export default function () {
  const hideMenu = useHeaderStore((state) => state.hideMenu);

  return (
    <NavbarMenu className="h-full pt-4 pb-4" onClick={hideMenu}>
      <NavbarMenuItem>
        <div
          className="max-w-compact w-full mx-auto"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="sm:hidden mb-4">
            <Search />
          </div>

          <ScrollShadow className="gap-2 grid grid-cols-1 sm:grid-cols-12 gird-rows-1 w-full overflow-y-auto max-h-[calc(100vh-10rem)]">
            <div className="sm:col-span-6 flex flex-col gap-4 p-1">
              <CardPages />
              <CardProfile />
              <CardProjects />
            </div>

            <div className="sm:col-span-6 p-1">
              <CardArticles />
            </div>
          </ScrollShadow>
        </div>
      </NavbarMenuItem>
    </NavbarMenu>
  );
}
