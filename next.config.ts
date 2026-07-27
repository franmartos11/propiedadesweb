import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gvamax.ar',
      },
    ],
  },
};

export default nextConfig;
