import { type ReactNode } from "react";

export default async function ({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <div className="py-2">{children}</div>;
}
