import React from "react";
import { Button, CardBody, CardFooter, Chip } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className, "border-white border-4 bg-slate-50")}
      href="/blog"
      title="My Side Projects"
    >
      <CardBody className="space-y-2 mt-6">Hello</CardBody>
    </CardBlock>
  );
}
