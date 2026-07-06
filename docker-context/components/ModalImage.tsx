"use client";

import type { ComponentProps } from "react";
import { useDisclosure, Image } from "@heroui/react";
import clsx from "clsx";

import ZoomPanModal from "@/components/ZoomPanModal";

const REGEX_SHIELDS_BADGE =
  /img\.shields\.io\/badge|custom-icon-badges\.demolab\.com/;

export default function ({
  alt,
  propsImageModal,
  propsImageThumbnail,
  source,
}: Readonly<{
  alt: string;
  propsImageModal?: ComponentProps<typeof Image>;
  propsImageThumbnail?: ComponentProps<typeof Image>;
  source: string;
}>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isShieldsBadge = REGEX_SHIELDS_BADGE.test(source);

  return (
    <div
      className={clsx(
        "relative inline-block overflow-hidden markdown-modal-image border border-default-200 rounded-md",
        { "w-full bg-default-100 dark:bg-default-50": !isShieldsBadge },
      )}
    >
      <Image
        src={source}
        alt={alt}
        radius="md"
        shadow="none"
        removeWrapper
        {...propsImageThumbnail}
        onClick={onOpen}
        className={clsx(
          "cursor-pointer w-max",
          { "mx-auto": !isShieldsBadge },
          propsImageThumbnail?.className,
        )}
      />
      <span className="opacity-0 absolute left-0 top-0">{alt}</span>
      <ZoomPanModal isOpen={isOpen} onClose={onClose} title={alt.replaceAll("-", " ")}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={source}
          alt={alt}
          draggable={false}
          className={clsx(
            "w-auto h-auto max-h-full max-w-full object-contain shadow-none rounded-none",
            propsImageModal?.className,
          )}
        />
      </ZoomPanModal>
    </div>
  );
}
