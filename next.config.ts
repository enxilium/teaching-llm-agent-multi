import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  // Required for GitHub Pages subpath
  basePath: process.env.NODE_ENV === "production" ? "/teaching-llm-agent/teaching-llm-agent" : "",
  // Force Next.js to copy ALL public files
  experimental: {
    forceSwcTransforms: true
  }
};

export default nextConfig;