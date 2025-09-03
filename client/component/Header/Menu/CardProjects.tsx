"use client";

import { Card, Listbox, ListboxSection, ListboxItem } from "@heroui/react";
import { ExternalLinkIcon } from "lucide-react";

import { PROJECTS } from "@/setting/home";

export default function () {
  return (
    <Card shadow="sm">
      <Listbox
        aria-label="Projects"
        color="default"
        className="p-4"
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Projects">
          {PROJECTS.map((project) => {
            return (
              <ListboxItem
                classNames={{ title: "font-light truncate" }}
                endContent={
                  <ExternalLinkIcon size="1rem" strokeWidth="0.075rem" />
                }
                href={project.href}
                key={project.title}
                target="_blank"
                title={project.title}
              />
            );
          })}
        </ListboxSection>
      </Listbox>
    </Card>
  );
}
