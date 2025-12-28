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
  ScrollShadow,
  useDisclosure,
} from "@heroui/react";
import type { ComponentProps } from "react";
import { useState, useRef } from "react";
import clsx from "clsx";

export default function () {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const refInput = useRef<HTMLInputElement>(null);
  const refOutput = useRef<HTMLDivElement>(null);

  const [command, setCommand] = useState("");
  const [results, setResults] = useState<
    { type: "command" | "output"; value: string }[]
  >([]);

  const handleOpen = () => {
    onOpen();
    requestAnimationFrame(() => {
      refInput.current?.focus();
    });
  };

  const handleCommand: ComponentProps<typeof Input>["onKeyUp"] = (event) => {
    if (event.key === "Enter") {
      const time = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const outputs: typeof results = [
        ...results,
        { type: "command", value: `${time} $ ${command}\n` },
      ];

      const value = command.trim();
      if (value !== "") {
        switch (value) {
          case "show":
            outputs.push({
              type: "output",
              value:
                `NEXT_PUBLIC_DOCKERFILE_COMMIT_SHORT: ${process.env.NEXT_PUBLIC_DOCKERFILE_COMMIT_SHORT}\n` +
                `NEXT_PUBLIC_CLOUDFRONT_IMAGE: ${process.env.NEXT_PUBLIC_CLOUDFRONT_IMAGE}\n` +
                `NODE_ENV: ${process.env.NODE_ENV}\n`,
            });
            break;
          case "help":
            outputs.push({
              type: "output",
              value:
                "Commands:\n" +
                "  clear\t\t\tClear the terminal output\n" +
                "  help \t\t\tShow this help message\n" +
                "  show \t\tDisplay build information",
            });
            break;
          case "clear":
            outputs.length = 0;
            setResults([]);
            break;
          default:
            outputs.push({
              type: "output",
              value: `Command not found: ${value}\nRun help for available commands`,
            });
            break;
        }
      }

      setResults(outputs);
      setCommand("");
      requestAnimationFrame(() => {
        if (refOutput.current) {
          refOutput.current.scrollTop = refOutput.current.scrollHeight;
        }
      });
    }
  };

  return (
    <>
      <SquareTerminalIcon
        className="transition-opacity hover:opacity-80 cursor-pointer text-foreground"
        size="1.45rem"
        strokeWidth="0.075rem"
        onClick={handleOpen}
      />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Terminal</ModalHeader>
              <ModalBody>
                <ScrollShadow
                  className="w-full h-[35vh] p-4 flex flex-wrap content-start bg-foreground text-background rounded-md"
                  onClick={() => refInput.current?.focus()}
                  ref={refOutput}
                  size={0}
                >
                  {results.map((result, index) => {
                    const { type, value } = result;
                    return (
                      <p
                        key={index}
                        className={clsx(
                          "w-full grow-0 text-small leading-normal whitespace-pre-wrap",
                          { "font-bold": type === "command" }
                        )}
                      >
                        {value}
                      </p>
                    );
                  })}
                </ScrollShadow>
                <Divider />
                <Input
                  aria-label="Terminal"
                  classNames={{
                    inputWrapper: "bg-default-100",
                    input: "text-small",
                  }}
                  isClearable
                  labelPlacement="outside"
                  onKeyUp={handleCommand}
                  onValueChange={setCommand}
                  placeholder="Type a command"
                  ref={refInput}
                  startContent="$"
                  type="text"
                  value={command}
                />
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
