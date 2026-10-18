/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  compiler: { removeConsole: false },
  compress: true,
  distDir: "export",
  enablePrerenderSourceMaps: true,
  experimental: { browserDebugInfoInTerminal: true, globalNotFound: true },
  generateBuildId: async () => {
    const buildID = process.env.COMMIT_SHORT || "local";
    console.log("Generating build ID: " + buildID);
    return buildID;
  },
  images: {
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
    unoptimized: true,
  },
  logging: {
    fetches: { fullUrl: true, hmrRefreshes: true },
    incomingRequests: true,
  },
  output: "export",
  pageExtensions: ["ts", "tsx"],
  productionBrowserSourceMaps: true,
  reactStrictMode: process.env.NODE_ENV === "development",
  // `npm run watch` has no /api of its own, so it borrows the live comments
  // API; a comment posted locally is real and held as pending like any other.
  ...(process.env.NODE_ENV === "development" && {
    rewrites: async () => [
      {
        source: "/api/:path*",
        destination: "https://jinyu-zhang.com/api/:path*",
      },
    ],
  }),
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
      rule.test?.test?.(".svg"),
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
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    // Import YAML as raw text so the dev server watches it and hot-reloads

    return config;
  },
};

export default nextConfig;
