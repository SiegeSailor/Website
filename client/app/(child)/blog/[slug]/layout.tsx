import { getArticles } from "@/helper/article";
import Breadcrumb from "@/component/Breadcrumb";

export default async function ({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const articles = await getArticles();

  return (
    <div>
      <div className="mb-16">
        <Breadcrumb articles={articles} />
      </div>
      {children}
    </div>
  );
}
