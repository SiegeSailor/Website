import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

import Comment from "@site/source/components/Comment";

export default function () {
  const docusaurusContext = useDocusaurusContext();

  return (
    <Layout title="Read Me" description={docusaurusContext.siteConfig.tagline}>
      <main>
        A
        <Comment title="Read Me" />
      </main>
    </Layout>
  );
}
