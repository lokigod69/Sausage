import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product/brand imagery is served from /public for now. When a CDN or
    // headless source is added later, whitelist its domain here.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
