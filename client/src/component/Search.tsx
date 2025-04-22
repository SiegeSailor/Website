"use client";

import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Kbd,
  useDisclosure,
  Input,
  Divider,
} from "@heroui/react";

export default function () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        onPress={onOpen}
        aria-label="Search"
        className="w-full sm:w-48"
        radius="full"
        endContent={<Kbd keys={["command"]}>S</Kbd>}
        variant="bordered"
        startContent={
          <RiSearch2Line
            size="1.25rem"
            className="text-base text-default-400 pointer-events-none flex-shrink-0"
          />
        }
      >
        Search
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Search</ModalHeader>
              <ModalBody>
                <Input
                  aria-label="Search"
                  classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-sm",
                  }}
                  labelPlacement="outside"
                  placeholder="Type to search"
                  startContent={
                    <RiSearch2Line className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  disabled
                  type="search"
                />
                <Divider />
                <p className="opacity-50 pb-1">
                  Searching is not currently available.
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
