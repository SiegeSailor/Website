"use client";

import { ComponentProps, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EyeIcon, MoveUpIcon } from "lucide-react";
import { Listbox, ListboxItem, ListboxSection, Skeleton } from "@heroui/react";
import clsx from "clsx";

import { getAnchorsByContent } from "@/helper/article";

export const IDENTIFIER = "table-of-contents" as const;

const LEVEL_PADDING: Readonly<Record<number, string>> = {
  1: "pl-2",
  2: "pl-4",
  3: "pl-8",
  4: "pl-10",
  5: "pl-12",
  6: "pl-14",
} as const;

export default function ({
  anchors,
  propsContainer,
}: Readonly<{
  propsContainer?: ComponentProps<typeof Skeleton>;
  anchors: ReturnType<typeof getAnchorsByContent>;
}>) {
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
    <Skeleton isLoaded={!!identifier} {...propsContainer}>
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
            return (
              <ListboxItem
                classNames={{
                  base: clsx(LEVEL_PADDING[anchor.level]),
                  title: "font-medium",
                }}
                endContent={
                  <AnimatePresence>
                    {anchor.identifier === identifier && (
                      <motion.span
                        key="eye"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <EyeIcon size="1rem" strokeWidth="0.1rem" />
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
          classNames={{ title: "font-medium" }}
          endContent={<MoveUpIcon size="1rem" strokeWidth="0.1rem" />}
          href={`#${anchors[0].identifier}`}
          onPress={() => setIdentifier(anchors[0].identifier)}
          title="Back to Top"
        />
      </Listbox>
    </Skeleton>
  );
}
