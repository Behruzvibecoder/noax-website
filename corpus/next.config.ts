import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Anatomy reference imagery / 3D posters may live on a CDN. Extend as needed.
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
};

export default nextConfig;
