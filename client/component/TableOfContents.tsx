"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EyeIcon } from "lucide-react";
import { Listbox, ListboxItem, ListboxSection, Skeleton } from "@heroui/react";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helper/article";

export const IDENTIFIER = "table-of-contents" as const;

export default function ({
  anchors,
}: Readonly<{ anchors: ReturnType<typeof getAnchorsByContent> }>) {
  const [identifier, setIdentifier] = useState<string | null>(null);

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
    if (article) {
      article.addEventListener("scroll", handleScroll, { passive: true });
      handleScroll();

      return () => article.removeEventListener("scroll", handleScroll);
    }
  }, [anchors]);

  return (
    <Skeleton isLoaded={!!identifier}>
      <Listbox
        aria-label="Table of Contents"
        color="default"
        className="p-4"
        onAction={(key) => setIdentifier(() => String(key))}
        selectedKeys={identifier ? [identifier] : []}
        selectionMode="single"
        hideSelectedIcon
        variant="flat"
      >
        <ListboxSection title="Table of Contents">
          {anchors.map((anchor) => {
            return (
              <ListboxItem
                endContent={
                  <AnimatePresence>
                    {anchor.identifier === identifier && (
                      <motion.span
                        key="eye"
                        initial={{ scale: 0.25 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.25 }}
                        transition={{ duration: 0.25 }}
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
    </Skeleton>
  );
}
