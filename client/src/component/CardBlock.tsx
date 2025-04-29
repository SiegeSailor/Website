"use client";

import React from "react";
import * as next from "next";
import { Card, CardHeader, Chip } from "@heroui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export default function ({
  children,
  className,
  href,
  title,
  ...props
}: React.ComponentProps<typeof Card> & {
  className?: string;
  href: next.Route;
  title: string;
}) {
  const router = useRouter();
  return (
    <Card
      {...props}
      className={clsx(className, "border-background border-4 bg-default-200")}
      isPressable
      isHoverable
      onPress={() => router.push(href)}
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <div className="items-start">
          <Chip variant="bordered" size="sm" className="p-4 bg-background">
            <span className="font-semibold">{title}</span>
          </Chip>
        </div>
      </CardHeader>
      {children}
    </Card>
  );
}
