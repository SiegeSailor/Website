import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { Kbd } from "@heroui/kbd";
import { Button } from "@heroui/button";

export default function () {
  return (
    <Button
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
  );
}
