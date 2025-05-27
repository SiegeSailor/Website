import { ComponentProps } from "react";

import { getArticles } from "@/helper/article";
import Body from "@/component/CardBlog/Body";
import CardBlock from "@/component/CardBlock";

export default async function ({
  articles,
  ...props
}: Omit<ComponentProps<typeof CardBlock>, "href" | "title"> &
  Readonly<{
    className?: string;
    articles: Awaited<ReturnType<typeof getArticles>>;
  }>) {
  return (
    <CardBlock
      href="/blog"
      title="Let's Talk About Tech"
      {...props}
      contentBody={<Body articles={articles} />}
    />
  );
}
