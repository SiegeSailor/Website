"use server";

import { NavbarContent, NavbarBrand } from "@heroui/react";

import { generateTitle } from "@/helper/utility";
import Link from "@/component/Link";

const TITLE = generateTitle();

export default async function () {
  return (
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
  );
}
