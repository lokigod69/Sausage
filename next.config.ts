import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Product/brand imagery is served from /public for now. When a CDN or
    // headless source is added later, whitelist its domain here.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    /*
     * Next writes one srcset entry per width into the HTML for every image,
     * and on the branch page that came to 27 KB of the document. The widest
     * slot on this site is the category title image at 70vw of a 1240px
     * wrap, so 2048 already covers a 2x display and 3840 was only ever
     * bloat. The small end is the 44px product thumbnails and the 112px
     * aisle cards; nothing is rendered at 16 or 32.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
