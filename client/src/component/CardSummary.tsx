import React from "react";
import { Button, CardBody, CardFooter, Chip } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className, "border-white border-4 bg-slate-50")}
      href="/blog"
      title="What I Bring to the Table"
    >
      <CardBody className="space-y-2 mt-6">fdsafdsa</CardBody>
    </CardBlock>
  );
}
