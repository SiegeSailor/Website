import React from "react";
import { RiSearch2Line } from "react-icons/ri";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";

export default function () {
  //   return <Input
  //   aria-label="Search"
  //   classNames={{
  //     inputWrapper: "bg-default-100",
  //     input: "text-sm",
  //   }}
  //   endContent={
  //     <Kbd className="hidden lg:inline-block" keys={["command"]}>
  //       K
  //     </Kbd>
  //   }
  //   labelPlacement="outside"
  //   placeholder="Search..."
  //   startContent={
  //     <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
  //   }
  //   type="search"
  // />
  return (
    <div>
      <Button
        startContent={
          <RiSearch2Line
            size="1.25rem"
            className="text-base text-default-400 pointer-events-none flex-shrink-0"
          />
        }
        size="md"
        variant="bordered"
      >
        Type <Kbd keys={["command"]}>S</Kbd> to search
      </Button>
    </div>
  );
}
