import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Giscus from "@giscus/react";
import Link from "@docusaurus/Link";

import styles from "./styles.module.css";

export default function Comments(props: { title: string }): JSX.Element {
  const docusaurusContext = useDocusaurusContext();
  const [isOpen, setIsOpen] = React.useState();

  const title = `${props.title} | ${docusaurusContext.siteConfig.title}`;

  return (
    <div className={styles.container}>
      <h4>
        Your can find your comment on{" "}
        <Link to="https://github.com/SiegeSailor/Website/discussions/categories/comments">
          Discussions
        </Link>{" "}
        {title}.
      </h4>
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
    </div>
  );
}
