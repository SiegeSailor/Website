import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Comment from "@site/source/components/Comment";

export default function () {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Read Me" description={siteConfig.tagline}>
      <main>
        A
        <Comment />
      </main>
    </Layout>
  );
}
