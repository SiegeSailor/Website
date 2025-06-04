import { ReactNode } from "react";

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="w-full h-full">{children}</div>;
}
