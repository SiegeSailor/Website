"use server";

import { NavbarMenu, NavbarMenuItem } from "@heroui/react";

import { getArticles } from "@/helper/server/article";
import { getProfile } from "@/helper/server/document";
import CardArticles from "./CardArticles";
import CardPages from "./CardPages";
import CardProfile from "./CardProfile";
import Search from "@/component/Search";

export default async function () {
  const articles = await getArticles();
  const profile = await getProfile();

  return (
    <NavbarMenu className="h-full pt-4 pb-4">
      <NavbarMenuItem>
        <div className="max-w-compact w-full mx-auto">
          <div className="sm:hidden mb-4">
            <Search />
          </div>

          <div className="gap-2 grid grid-cols-1 sm:grid-cols-12 gird-rows-1 w-full overflow-y-auto max-h-[calc(100vh-10rem)]">
            <div className="sm:col-span-6 flex flex-col gap-4 p-1">
              <CardPages />
              <CardProfile profile={profile} />
            </div>

            <div className="sm:col-span-6 p-1">
              <CardArticles articles={articles} />
            </div>
          </div>
        </div>
      </NavbarMenuItem>
    </NavbarMenu>
  );
}
