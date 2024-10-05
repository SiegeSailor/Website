import React from "react";

import Giscus from "@giscus/react";

const CommentsSection = (): JSX.Element => {
  return (
    <Giscus
      category="Comments"
      categoryId="DIC_kwDOM7PwvM4CjE_u"
      emitMetadata="1"
      id="comments"
      inputPosition="top"
      lang="en"
      loading="lazy"
      mapping="title"
      reactionsEnabled="1"
      repo="siegesailor/Website"
      repoId="R_kgDOM7PwvA="
      strict="0"
      theme="light"
    />
  );
};

export default CommentsSection;
