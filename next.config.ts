import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Required for GitHub Pages subpath
  basePath: "/teaching-llm-agent",
};

export default nextConfig;