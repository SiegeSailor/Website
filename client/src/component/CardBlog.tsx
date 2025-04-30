import React from "react";
import { Button, CardBody, CardFooter, Chip } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="Let's Talk About Tech"
    >
      <CardBody className="space-y-2 mt-6">fdsafdsa</CardBody>
    </CardBlock>
  );
}
