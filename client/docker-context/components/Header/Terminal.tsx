"use client";

import { SquareTerminalIcon } from "lucide-react";
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

//  <SquareTerminalIcon
//       size="1.45rem"
//       className="text-default-500/40 translate-y-px"
//     />

export default function () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <SquareTerminalIcon
        className="transition-opacity hover:opacity-80 cursor-pointer text-foreground"
        size="1.45rem"
        strokeWidth="0.075rem"
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Search</ModalHeader>
              <ModalBody>
                <Input
                  aria-label="Search"
                  classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-small",
                  }}
                  labelPlacement="outside"
                  placeholder="Type to search"
                  startContent={
                    <SquareTerminalIcon className="text-base text-default-400 pointer-events-none shrink-0" />
                  }
                  disabled
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
