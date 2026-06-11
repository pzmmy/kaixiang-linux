import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/kaixiang-linux',
  assetPrefix: '/kaixiang-linux',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
