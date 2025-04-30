"use client";

import React from "react";
import * as next from "next";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function ({
  children,
  className,
  contentHeader,
  href,
  title,
  ...props
}: React.ComponentProps<typeof Card> & {
  className?: string;
  contentHeader?: React.ReactNode;
  href: next.Route;
  title: string;
}) {
  const router = useRouter();
  return (
    <Card
      {...props}
      className={clsx(
        className,
        "border-background dark:border-default-100 border-2 bg-default-50"
      )}
      isPressable
      isHoverable
      onPress={() => router.push(href)}
    >
      <CardHeader className="absolute z-20 top-0 flex-col items-start">
        <div className="items-start">
          <Chip variant="bordered" size="sm" className="p-4 bg-background">
            <span className="font-semibold">{title}</span>
          </Chip>
        </div>
        {contentHeader}
      </CardHeader>
      <CardBody className="mt-10">{children}</CardBody>
    </Card>
  );
}
