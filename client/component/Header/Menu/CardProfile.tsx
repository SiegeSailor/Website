"use client";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";

import { useDocumentStore } from "@/store/document";
import { useRoute } from "@/helper/client/history";

export default function () {
  const profile = useDocumentStore((state) => state.profile);

  const { route } = useRoute();

  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Profile"
        color="default"
        className="p-4"
        disabledKeys={[route]}
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
                    classNames={{ title: "font-light truncate" }}
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
