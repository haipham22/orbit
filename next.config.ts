import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clerk auth() ngoài <Suspense> fail build khi cacheComponents bật
  cacheComponents: false,
  output: "standalone",
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
