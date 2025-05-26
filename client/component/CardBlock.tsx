"use client";

import React from "react";
import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Route } from "next";
import clsx from "clsx";

import SpinnerCenter from "@/component/SpinnerCenter";

export default function ({
  children,
  className,
  contentHeader,
  contentBody,
  href,
  title,
  ...props
}: React.ComponentProps<typeof Card> & {
  className?: string;
  contentHeader?: React.ReactNode;
  contentBody?: React.ReactNode;
  href?: Route;
  title: string;
}) {
  const router = useRouter();

  return (
    <Card
      isHoverable
      isPressable
      onPress={() => {
        if (href) router.push(href);
      }}
      {...props}
      className={clsx(
        className,
        "border-background dark:border-default-100",
        "border-2 bg-default-50 relative",
        "overflow-hidden"
      )}
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
      <React.Suspense fallback={<SpinnerCenter className="mt-12" />}>
        {contentBody}
      </React.Suspense>
      {children && (
        <CardBody className="mt-12 overflow-hidden">
          <React.Suspense fallback={<SpinnerCenter />}>
            {children}
          </React.Suspense>
        </CardBody>
      )}
    </Card>
  );
}
