import React from "react";
import { Spinner } from "@heroui/react";

export default function () {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner color="default" className="h-64 w-64" />
    </div>
  );
}
