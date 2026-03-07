"use client";

import { SearchIcon } from "lucide-react";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";

export default function () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        aria-label="Search"
        className="w-full sm:w-32 font-light"
        onPress={onOpen}
        radius="full"
        startContent={
          <SearchIcon
            className="text-base text-default-400 pointer-events-none shrink-0"
            size="1.45rem"
            strokeWidth="0.075rem"
          />
        }
        variant="bordered"
      >
        Search
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Search</ModalHeader>
              <ModalBody>
                <Input
                  aria-label="Search"
                  classNames={{ inputWrapper: "bg-default-100" }}
                  // See https://github.com/heroui-inc/heroui/issues/5326.
                  size="lg"
                  labelPlacement="outside"
                  placeholder="Type to search"
                  startContent={
                    <SearchIcon className="text-base text-default-400 pointer-events-none shrink-0" />
                  }
                  disabled
                  isClearable
                  type="search"
                />
                <Divider />
                <p className="opacity-disabled">
                  Searching is currently unavailable.
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
