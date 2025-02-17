import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: false,
  basePath: process.env.NODE_ENV === "production" ? "/teaching-llm-agent-multi" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/teaching-llm-agent-multi/" : "",
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;