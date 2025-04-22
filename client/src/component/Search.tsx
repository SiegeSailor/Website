import React from "react";
import { CiSearch } from "react-icons/ci";
import { Button } from "@heroui/button";
import { Kbd } from "@heroui/kbd";
import { Divider } from "@heroui/divider";

export default function () {
  return (
    <div>
      <Button startContent={<CiSearch />} size="sm" variant="bordered">
        Type <Kbd keys={["command"]}>S</Kbd> to search
      </Button>
      <Divider orientation="vertical" />
    </div>
  );
}
