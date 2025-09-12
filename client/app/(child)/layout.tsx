import { ReactNode } from "react";

import Breadcrumb from "@/component/Breadcrumb";

export default async function ({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="w-full h-full">
      <div className="max-w-content mx-auto p-4">
        <Breadcrumb />
      </div>

      {children}
    </div>
  );
}
