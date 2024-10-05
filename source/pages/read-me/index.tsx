import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function () {
  const docusaurusContext = useDocusaurusContext();

  return (
    <Layout title="Read Me" description={docusaurusContext.siteConfig.tagline}>
      <main>A</main>
    </Layout>
  );
}
