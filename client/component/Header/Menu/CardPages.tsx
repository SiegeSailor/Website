"use client";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";
import { usePathname } from "next/navigation";

import { getEntries } from "@/helper/utility";
import { ROUTE_ICON } from "@/setting/icon";
import { TITLE_ROUTE } from "@/setting/site";

export default function () {
  const pathname = usePathname();

  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Pages"
        color="default"
        className="p-4"
        disabledKeys={[pathname]}
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Pages">
          {getEntries(TITLE_ROUTE).map(([title, route]) => {
            const Icon = ROUTE_ICON[route];

            return (
              <ListboxItem
                classNames={{ title: "font-light text-medium" }}
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
