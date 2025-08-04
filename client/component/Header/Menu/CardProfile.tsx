"use client";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";

import { useRoute } from "@/helper/client/history";
import { getProfile } from "@/helper/server/document";

export default function ({
  profile,
}: Readonly<{ profile: Awaited<ReturnType<typeof getProfile>> }>) {
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
          {profile.metadata.anchors
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
