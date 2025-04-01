import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
  output: 'standalone', // Optimize for Docker deployment
};

export default nextConfig;
