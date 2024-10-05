import React from "react";
import BlogPostPage from "@theme-original/BlogPostPage";
import type BlogPostPageType from "@theme/BlogPostPage";
import type { WrapperProps } from "@docusaurus/types";

import Comment from "@site/source/components/Comment";

type Props = WrapperProps<typeof BlogPostPageType>;

export default function BlogPostPageWrapper(props: Props): JSX.Element {
  return (
    <>
      <BlogPostPage {...props} />
      <Comment title={props.content.metadata.title} />
    </>
  );
}
