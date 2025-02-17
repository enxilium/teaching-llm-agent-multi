import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Required for GitHub Pages subpath
  basePath: process.env.NODE_ENV === "production" ? "/teaching-llm-agent" : "",
  images: { unoptimized: true }
};

export default nextConfig;