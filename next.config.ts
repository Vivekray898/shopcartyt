import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  // FIXED: Removed the deprecated 'eslint' block to fix the TS2353 validation error.
  // Next.js v16 handles builds through Turbopack natively now.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;