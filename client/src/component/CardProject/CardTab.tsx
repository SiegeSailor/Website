"use server";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import clsx from "clsx";

export default async function ({
  children,
  title,
  ...props
}: { title: string } & React.ComponentProps<typeof Card>) {
  const { content } = await new Promise<{ content: string }>((resolve) =>
    setTimeout(() => {
      resolve({ content: "content" });
    }, 1000)
  );
  return (
    <Card {...props} className={clsx(props.className, "h-40")}>
      <CardBody>
        <h4>{title}</h4>
        <p>{content}</p>
      </CardBody>
    </Card>
  );
}
