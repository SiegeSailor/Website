import { ReactNode } from "react";

import Breadcrumb from "@/components/Breadcrumb";

export default async function ({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="w-full h-full max-h-[calc(100%-4rem)]">
      <div className="max-w-content mx-auto p-4">
        <Breadcrumb />
      </div>

      {children}
    </div>
  );
}
