import React from "react";
import { Button, CardBody, CardFooter, Chip, Image } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock className={clsx(className)} href="/blog" title="My Skills">
      {["Python"].map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </CardBlock>
  );
}
