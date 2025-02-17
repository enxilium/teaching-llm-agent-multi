import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: false,
  // Required for GitHub Pages subpath
  basePath: process.env.NODE_ENV === "production" ? "/teaching-llm-agent" : "",
  images: {
    unoptimized: true,
    // Specify domains and paths that can serve images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Ensure static assets are copied to the output directory
  assetPrefix: process.env.NODE_ENV === "production" ? "/teaching-llm-agent/" : "",
  // Configure public directory handling
  publicRuntimeConfig: {
    staticFolder: '/public',
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;