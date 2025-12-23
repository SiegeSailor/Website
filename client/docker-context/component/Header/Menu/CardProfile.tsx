"use client";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";

import { useDocumentStore } from "@/store/document";
import { useRoute } from "@/helper/client/history";
import clsx from "clsx";

export default function () {
  const profile = useDocumentStore((state) => state.profile);

  const { route } = useRoute();

  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Profile"
        color="default"
        className="p-4"
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Profile">
          {profile &&
            profile.metadata.anchors
              .filter((anchor) => anchor.level === 2)
              .map((item) => {
                return (
                  <ListboxItem
                    classNames={{
                      title: clsx("font-light truncate text-medium", {
                        "font-semibold": route === item.route,
                      }),
                    }}
                    href={item.route}
                    key={item.route}
                    title={item.title}
                  />
                );
              })}
        </ListboxSection>
      </Listbox>
    </Card>
  );
}
