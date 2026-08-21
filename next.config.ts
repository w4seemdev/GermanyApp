import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 980, 1080, 1200, 1920, 2048],
    imageSizes: [256, 384, 512],
  },
};

export default nextConfig;
