"use server";

import { Spinner } from "@heroui/react";

import DivisionCenter from "@/component/DivisionCenter";

export default async function () {
  return (
    <DivisionCenter>
      <Spinner variant="simple" color="default" className="h-64 w-64" />
    </DivisionCenter>
  );
}
