"use server";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { ComponentProps, ReactNode } from "react";
import { Route } from "next";
import clsx from "clsx";

import Link from "@/component/Link";

export default async function ({
  contentHeader,
  contentBody,
  href,
  ...props
}: ComponentProps<typeof Card> &
  Readonly<{
    contentHeader?: ReactNode;
    contentBody?: ReactNode;
    href?: Route;
  }>) {
  return (
    <Card
      isHoverable
      isPressable
      {...props}
      className={clsx(
        "border-background dark:border-default-100 border-2 bg-default-50 relative overflow-hidden",
        props.className
      )}
    >
      <Link href={href} isPlain>
        <CardHeader className="absolute z-20 top-0 flex-col items-start">
          <div className="items-start z-20">
            <Chip variant="bordered" size="sm" className="p-4 bg-background">
              <span className="font-medium">{props.title}</span>
            </Chip>
          </div>
          {contentHeader}
        </CardHeader>
        {contentBody}
        {props.children && (
          <CardBody className="mt-12 overflow-hidden">
            {props.children}
          </CardBody>
        )}
      </Link>
    </Card>
  );
}
