"use client";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import clsx from "clsx";

import { getEntries } from "@/helpers/utility";
import { ROUTE_TO_ICON } from "@/settings/icons";
import { TITLE_TO_ROUTE } from "@/settings/constant";

export default function () {
  const pathname = usePathname();

  const loader = useTopLoader();

  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Pages"
        color="default"
        className="p-4"
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Pages">
          {getEntries(TITLE_TO_ROUTE).map(([title, route]) => {
            const Icon = ROUTE_TO_ICON[route];

            return (
              <ListboxItem
                classNames={{
                  title: clsx("font-light text-medium", {
                    "font-semibold": pathname === route,
                  }),
                }}
                onClick={() => loader.start()}
                endContent={<Icon size="1rem" strokeWidth="0.1rem" />}
                href={route}
                key={route}
                title={title}
              />
            );
          })}
        </ListboxSection>
      </Listbox>
    </Card>
  );
}
