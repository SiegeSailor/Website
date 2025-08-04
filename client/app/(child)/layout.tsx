import clsx from "clsx";

import { getArticles } from "@/helper/server/article";
import Breadcrumb from "@/component/Breadcrumb";

export default async function ({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const articles = await getArticles();

  return (
    <div className="w-full h-full">
      <div className={clsx("max-w-content mx-auto p-4")}>
        <Breadcrumb articles={articles} />
      </div>

      {children}
    </div>
  );
}
