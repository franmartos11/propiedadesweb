import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 604800, // Cache de imágenes por 7 días
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gvamax.ar',
      },
    ],
  },
};

export default nextConfig;
