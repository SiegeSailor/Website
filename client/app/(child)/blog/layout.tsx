import { ReactNode } from "react";

import { getArticles } from "@/helper/article";

export default async function ({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const articles = await getArticles();

  return <div className="w-full h-full">{children}</div>;
}
