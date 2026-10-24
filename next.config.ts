import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackMemoryOptimizations: true,
    cpus: 1,
    staticGenerationMaxConcurrency: 1,
  },
};

export default nextConfig;
