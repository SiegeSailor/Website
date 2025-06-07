"use client";

import { useEffect, useState } from "react";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import { EyeIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helper/article";

export const IDENTIFIER = "table-of-contents" as const;

export default function ({
  anchors,
}: Readonly<{ anchors: ReturnType<typeof getAnchorsByContent> }>) {
  const [identifier, setIdentifier] = useState<string>(anchors[0].identifier);

  useEffect(() => {
    const handleScroll = () => {
      const headings = anchors
        .map((anchor) => document.getElementById(anchor.identifier))
        .filter(Boolean) as HTMLElement[];

      for (const heading of headings) {
        const { top } = heading.getBoundingClientRect();
        if (top <= 180) {
          setIdentifier(heading.id);
        } else {
          break;
        }
      }
    };

    const article = document.getElementById(IDENTIFIER);
    if (!article) return;

    article.addEventListener("scroll", handleScroll, { passive: true });

    return () => article.removeEventListener("scroll", handleScroll);
  }, [anchors]);

  return (
    <Listbox
      aria-label="Table of Contents"
      color="default"
      onAction={(key) => setIdentifier(() => String(key))}
      selectedKeys={[identifier]}
      selectionMode="single"
      hideSelectedIcon
      variant="flat"
    >
      <ListboxSection title="Table of Contents">
        {anchors.map((anchor) => {
          const isSelected = anchor.identifier === identifier;

          return (
            <ListboxItem
              endContent={
                <AnimatePresence>
                  {isSelected && (
                    <motion.span
                      key="eye"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      style={{ display: "inline-flex" }}
                    >
                      <EyeIcon size="1rem" strokeWidth="0.1rem" />
                    </motion.span>
                  )}
                </AnimatePresence>
              }
              className={clsx(
                {
                  1: "pl-2",
                  2: "pl-4",
                  3: "pl-8",
                  4: "pl-10",
                  5: "pl-12",
                  6: "pl-14",
                }[anchor.level]
              )}
              key={anchor.identifier}
              href={`#${anchor.identifier}`}
            >
              {anchor.title}
            </ListboxItem>
          );
        })}
      </ListboxSection>
    </Listbox>
  );
}
