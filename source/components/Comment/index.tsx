import React from "react";
import Giscus from "@giscus/react";

import styles from "./styles.module.scss";

export default function Comments(): JSX.Element {
  return (
    <div className={styles.module}>
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
        theme="preferred_color_scheme"
      />
    </div>
  );
}
