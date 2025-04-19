/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: ".next",
  experimental: {
    typedRoutes: true,
  },
  output: "standalone",
};

export default nextConfig;
