"use client";

import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import * as next from "next";
import clsx from "clsx";

import SpinnerCenter from "@/component/SpinnerCenter";

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
        <div className="items-start z-20">
          <Chip variant="bordered" size="sm" className="p-4 bg-background">
            <span className="font-semibold">{title}</span>
          </Chip>
        </div>
        <React.Suspense fallback={<SpinnerCenter />}>
          {contentHeader}
        </React.Suspense>
      </CardHeader>
      <CardBody className="mt-10">
        <React.Suspense fallback={<SpinnerCenter />}>{children}</React.Suspense>
      </CardBody>
    </Card>
  );
}
