import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { Kbd } from "@heroui/kbd";
import { Input } from "@heroui/input";

export default function () {
  return (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: ["bg-default-100", "sm:w-52"],
        input: ["text-sm"],
      }}
      endContent={<Kbd keys={["command"]}>S</Kbd>}
      labelPlacement="outside"
      placeholder="Search"
      startContent={
        <RiSearch2Line
          size="1.25rem"
          className="text-base text-default-400 pointer-events-none flex-shrink-0"
        />
      }
      type="search"
    />
  );
}
