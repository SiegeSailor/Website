"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoveLeftIcon, MoveUpIcon } from "lucide-react";
import { Listbox, ListboxItem, ListboxSection } from "@heroui/react";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helpers/article";

export const IDENTIFIER = "table-of-contents" as const;

const LEVEL_TO_PADDING: Readonly<Record<number, string>> = {
  1: "pl-2",
  2: "pl-4",
  3: "pl-8",
  4: "pl-10",
  5: "pl-12",
  6: "pl-14",
} as const;

export default function ({
  anchors,
}: Readonly<{
  anchors: ReturnType<typeof getAnchorsByContent>;
}>) {
  const [identifier, setIdentifier] = useState(anchors[0].identifier);

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

    document.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => document.removeEventListener("scroll", handleScroll);
  }, [anchors]);

  return (
    <Listbox
      aria-label="Table of Contents"
      color="default"
      className="p-4"
      onAction={(key) => setIdentifier(() => String(key))}
      selectedKeys={identifier ? [identifier] : []}
      hideSelectedIcon
      variant="flat"
    >
      <ListboxSection title="Table of Contents" showDivider>
        {anchors.map((anchor) => {
          const isBrowsing = anchor.identifier === identifier;

          return (
            <ListboxItem
              classNames={{
                base: clsx(LEVEL_TO_PADDING[anchor.level]),
                title: isBrowsing ? "font-normal" : "font-light",
              }}
              endContent={
                <AnimatePresence>
                  {isBrowsing && (
                    <motion.span
                      key="eye"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <MoveLeftIcon size="1rem" strokeWidth="0.1rem" />
                    </motion.span>
                  )}
                </AnimatePresence>
              }
              href={`#${anchor.identifier}`}
              key={anchor.identifier}
              title={anchor.title}
            />
          );
        })}
      </ListboxSection>
      <ListboxItem
        classNames={{ title: "font-light" }}
        endContent={<MoveUpIcon size="1rem" strokeWidth="0.1rem" />}
        href={`#${anchors[0].identifier}`}
        onPress={() => setIdentifier(anchors[0].identifier)}
        title="Go Back to Top"
      />
    </Listbox>
  );
}
