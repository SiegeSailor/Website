import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function () {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Read Me" description={siteConfig.tagline}>
      <main>A</main>
    </Layout>
  );
}
