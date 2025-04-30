import React from "react";
import { Button, CardBody, CardFooter, Chip, Image } from "@heroui/react";
import { SiPython } from "react-icons/si";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock className={clsx(className)} href="/blog" title="My Skills">
      {[{ name: "Python", icon: <SiPython /> }].map((item) => (
        <Chip
          key={item.name}
          className="px-2 py-1"
          variant="flat"
          startContent={item.icon}
        >
          {item.name}
        </Chip>
      ))}
    </CardBlock>
  );
}
