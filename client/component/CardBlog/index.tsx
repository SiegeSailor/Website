import clsx from "clsx";

import { getArticles } from "@/helper/article";
import Body from "@/component/CardBlog/Body";
import CardBlock from "@/component/CardBlock";

export default async function ({
  articles,
  className,
}: Readonly<{
  className?: string;
  articles: Awaited<ReturnType<typeof getArticles>>;
}>) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="Let's Talk About Tech"
      isFooterBlurred
      contentBody={<Body articles={articles} />}
    />
  );
}
