"use client";

import React from "react";
import { Button, CardBody, CardFooter, Image } from "@heroui/react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";
import MotionFloating from "@/component/MotionFloating";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="Let's Talk About Tech"
    >
      <MotionFloating>
        <Image
          removeWrapper
          alt="Card background"
          className="w-16 h-16"
          src="https://heroui.com/images/card-example-4.jpeg"
        />
      </MotionFloating>
      <div className="absolute bottom-4 left-0 w-full text-center">
        <p className="text-lg">Docker Mount in GitLab Runners</p>
        <p className="text-default-400 text-sm">2024-10-16</p>
      </div>
    </CardBlock>
  );
}
