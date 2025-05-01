import React from "react";
import clsx from "clsx";

import CardBlock from "@/component/CardBlock";
import Body from "@/component/CardBlog/Body";

export default function ({ className }: { className?: string }) {
  return (
    <CardBlock
      className={clsx(className)}
      href="/blog"
      title="Let's Talk About Tech"
      isFooterBlurred
      contentBody={<Body />}
    />
  );
}
