import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration
  turbopack: {
    resolveAlias: {
      // Handle canvas for react-pdf (not available in browser)
      canvas: "./empty-module.js",
    },
  },

  // Webpack fallback (for build)
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },

  // Enable standalone output for Docker
  output: 'standalone',

  reactStrictMode: true,
};

export default nextConfig;
