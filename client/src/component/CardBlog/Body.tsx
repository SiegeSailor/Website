"use server";

import React from "react";
import { Image } from "@heroui/react";
import clsx from "clsx";
import NextImage from "next/image";

import MotionFloating from "@/component/MotionFloating";

export default async function () {
  const { date, title, image } = await new Promise<{
    date: string;
    title: string;
    image: string;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        date: "2024-10-16",
        title: "Build WEP Webkit on Linux",
        image: "/weston-cog-google.png",
      });
    }, 1000);
  });

  return (
    <>
      <Image
        alt={title}
        as={NextImage}
        className={clsx(
          "z-0 w-full h-full",
          "object-cover grayscale brightness-50 contrast-100"
        )}
        src={image}
        removeWrapper
        width={4032}
        height={3024}
      />
      <MotionFloating
        direction="vertical"
        className="absolute top-1/2 left-4 w-full z-10 justify-start"
      >
        <p
          className={clsx(
            "text-background dark:text-foreground",
            "opacity-60",
            "font-bold text-sm text-left"
          )}
        >
          {date}
        </p>
        <p
          className={clsx(
            "text-background dark:text-foreground",
            "font-medium text-xl text-left"
          )}
        >
          {title}
        </p>
      </MotionFloating>
    </>
  );
}
