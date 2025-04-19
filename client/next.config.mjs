/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next",
  redirects: async () => [],
  experimental: {
    esmExternals: false,
    typedRoutes: true,
  },
  output: "standalone",
  images: {
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
  },
  webpack: (config) => {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        resourceQuery: /url/,
        test: /\.svg$/i,
      },
      {
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
        test: /\.svg$/i,
        use: ["@svgr/webpack"],
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default nextConfig;
