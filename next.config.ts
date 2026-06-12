import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/kaixiang-linux',
  assetPrefix: '/kaixiang-linux',
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: '/kaixiang-linux',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
