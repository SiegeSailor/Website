"use client";

import {
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  ScrollShadow,
} from "@heroui/react";
import clsx from "clsx";

export default function ({
  source,
  alt,
}: Readonly<{ source: string; alt: string }>) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className={clsx("bg-default-100 dark:bg-default-50", "rounded-md")}>
      <Image
        src={source}
        alt={alt}
        onClick={onOpen}
        radius="md"
        className="cursor-pointer"
      />
      <Modal isOpen={isOpen} onClose={onClose} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{alt.replaceAll("-", " ")}</ModalHeader>
              <ModalBody>
                <ScrollShadow className={clsx("h-full w-full max-h-[65vh]")}>
                  <Image
                    className={clsx("w-max max-w-max")}
                    removeWrapper
                    src={source}
                    alt={alt}
                    onClick={onClose}
                    radius="md"
                    shadow="sm"
                  />
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
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
