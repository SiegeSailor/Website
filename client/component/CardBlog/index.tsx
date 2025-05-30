import { ComponentProps } from "react";
import dynamic from "next/dynamic";

import { getArticles } from "@/helper/article";
import CardBlock from "@/component/CardBlock";
import SpinnerCenter from "@/component/SpinnerCenter";

const Body = dynamic(
  () => import("@/component/CardBlog/Body").then((module) => module.default),
  { ssr: true, loading: () => <SpinnerCenter /> }
);

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
      title="More Insights on My Blog"
      {...props}
      contentBody={<Body articles={articles} />}
    />
  );
}
