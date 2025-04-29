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
}: {
  children: Readonly<React.ReactNode>;
  className?: string;
  href: next.Route;
  title: string;
}) {
  const router = useRouter();
  return (
    <Card
      className={clsx(className, "border-white border-4 bg-slate-50")}
      isPressable
      isHoverable
      onPress={() => router.push(href)}
    >
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <div className="items-start">
          <Chip variant="shadow" size="sm" className="p-4 bg-white">
            <span className="font-semibold">{title}</span>
          </Chip>
        </div>
      </CardHeader>
      {children}
    </Card>
  );
}
