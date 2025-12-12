/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  compiler: { removeConsole: false },
  compress: true,
  distDir: ".next",
  experimental: { browserDebugInfoInTerminal: true, globalNotFound: true },
  generateBuildId: async () => {
    console.log("Generating build ID: " + process.env.COMMIT_SHORT);
    return process.env.COMMIT_SHORT;
  },
  images: {
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
  },
  logging: {
    fetches: { fullUrl: true, hmrRefreshes: true },
    incomingRequests: true,
  },
  output: "standalone",
  pageExtensions: ["ts", "tsx"],
  productionBrowserSourceMaps: true,
  reactStrictMode: process.env.NODE_ENV === "development",
  redirects: async () => [],
  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: { removeViewBox: false },
                    },
                  },
                  "removeDimensions",
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
  },
  typedRoutes: true,
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
