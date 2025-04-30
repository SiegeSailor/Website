"use client";

import React from "react";
import { Button, CardBody, CardFooter, Chip, Image } from "@heroui/react";
import { SiPython, SiTypescript, SiGnubash, SiCplusplus } from "react-icons/si";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";
import MotionFloating from "@/component/MotionFloating";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock className={clsx(className)} href="/blog" title="My Skills">
      <div className="w-64 flex gap-2 flex-wrap">
        {[
          { name: "Python", icon: <SiPython /> },
          { name: "TypeScript", icon: <SiTypescript /> },
          { name: "Bash", icon: <SiGnubash /> },
          { name: "C++", icon: <SiCplusplus /> },
        ].map((item) => (
          <MotionFloating key={item.name} duration={Math.random()}>
            <Chip className="px-2 py-1" variant="flat" startContent={item.icon}>
              {item.name}
            </Chip>
          </MotionFloating>
        ))}
      </div>
    </CardBlock>
  );
}
