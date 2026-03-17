import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    useLightningcss: true,
  },
  output: "standalone",
};

export default nextConfig;
