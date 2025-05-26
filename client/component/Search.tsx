"use client";

import { LuSearch } from "react-icons/lu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
          <LuSearch
            size="1.45rem"
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
                    <LuSearch className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                  }
                  disabled
                  type="search"
                />
                <Divider />
                <p className="opacity-50">
                  Searching is currently Unavailable.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
