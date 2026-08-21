import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home directory makes Turbopack infer the
  // wrong workspace root and ignore this project's lockfile. Pin it explicitly.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 980, 1080, 1200, 1920, 2048],
    imageSizes: [256, 384, 512],
  },
};

export default nextConfig;
