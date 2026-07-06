"use client";

import { usePathname } from "next/navigation";

export default function () {
  const pathname = usePathname();
  return <span className="font-mono">{pathname}</span>;
}
