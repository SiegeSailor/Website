import { resolveBuildTargetConfig } from "./build-target.mjs";

/** @type {import('next').NextConfig} */
const buildTargetConfig = resolveBuildTargetConfig();
const isStaticBuild = buildTargetConfig.output === "export";

const nextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  compiler: { removeConsole: false },
  compress: true,
  distDir: buildTargetConfig.distDir,
  enablePrerenderSourceMaps: true,
  experimental: { browserDebugInfoInTerminal: true, globalNotFound: true },
  generateBuildId: async () => {
    const buildID = process.env.COMMIT_SHORT || "local";
    console.log("Generating build ID: " + buildID);
    return buildID;
  },
  headers: isStaticBuild
    ? undefined
    : async () => {
        return [
          {
            source: "/images/:path*",
            headers: [
              {
                key: "Cache-Control",
                value: "public, max-age=31536000, immutable",
              },
            ],
          },
        ];
      },
  images: {
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    dangerouslyAllowSVG: true,
    unoptimized: buildTargetConfig.images.unoptimized,
  },
  logging: {
    fetches: { fullUrl: true, hmrRefreshes: true },
    incomingRequests: true,
  },
  output: buildTargetConfig.output,
  pageExtensions: ["ts", "tsx"],
  productionBrowserSourceMaps: true,
  reactStrictMode: process.env.NODE_ENV === "development",
  redirects: isStaticBuild ? undefined : async () => [],
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

    return config;
  },
};

export default nextConfig;
