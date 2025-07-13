"use client";

import { useState, ComponentProps } from "react";
import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
} from "@heroui/react";
import { PlusIcon, MinusIcon } from "lucide-react";
import clsx from "clsx";

const ZOOM_MAX = 10 as const;
const ZOOM_MIN = 1 as const;
const ZOOM_STEP = 0.25 as const;

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

  const [zoom, setZoom] = useState<number>(ZOOM_MIN);

  const handleOpen = (
    event: Parameters<NonNullable<ComponentProps<typeof Image>["onClick"]>>[0]
  ) => {
    setZoom(ZOOM_MIN);
    if (propsImageThumbnail?.onClick) propsImageThumbnail.onClick(event);
    onOpen();
  };

  const handleZoomIn = () => {
    setZoom((previous) => Math.min(previous + ZOOM_STEP, ZOOM_MAX));
  };

  const handleZoomOut = () => {
    setZoom((previous) => Math.max(previous - ZOOM_STEP, ZOOM_MIN));
  };

  const handleResetZoom = () => {
    setZoom(ZOOM_MIN);
  };

  const handleModalClose = () => {
    setZoom(ZOOM_MIN);
    onClose();
  };

  return (
    <div
      className={clsx(
        "bg-default-100 dark:bg-default-50",
        "rounded-md shadow-md",
        "inline-block",
        "markdown-modal-image"
      )}
    >
      <Image
        src={source}
        alt={alt}
        radius="md"
        shadow="none"
        removeWrapper
        {...propsImageThumbnail}
        onClick={handleOpen}
        className={clsx(
          "cursor-pointer",
          "w-max h-max",
          propsImageThumbnail?.className
        )}
      />
      <Modal isOpen={isOpen} onClose={handleModalClose} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{alt.replaceAll("-", " ")}</ModalHeader>
              <ModalBody>
                <div className={clsx("h-[65vh] w-full", "overflow-auto")}>
                  <Image
                    removeWrapper
                    src={source}
                    alt={alt}
                    radius="none"
                    shadow="none"
                    {...propsImageThumbnail}
                    className={clsx(
                      "block w-auto h-auto",
                      "transition-transform duration-200 origin-top-left",
                      propsImageModal?.className
                    )}
                    style={{ transform: `scale(${zoom})` }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <div className={clsx("flex items-center justify-center gap-2")}>
                  <Button
                    size="sm"
                    variant="light"
                    color="default"
                    onPress={handleZoomOut}
                    disabled={zoom <= ZOOM_MIN}
                  >
                    <MinusIcon
                      size="1.25rem"
                      className={clsx(
                        zoom <= ZOOM_MIN &&
                          "text-default-500 text-opacity-disabled"
                      )}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="default"
                    onPress={handleResetZoom}
                  >
                    {Math.round(zoom * 100)}%
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="default"
                    onPress={handleZoomIn}
                    disabled={zoom >= ZOOM_MAX}
                  >
                    <PlusIcon size="1.25rem" />
                  </Button>
                </div>
                <Button variant="light" color="default" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
