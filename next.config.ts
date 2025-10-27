import type { NextConfig } from "next";

const nextConfig = {
 images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dvnwtmvqs/**',
      },
    ],
    formats: ['image/avif', 'image/webp'], 
  },
  loader: 'custom',
  loaderFile: './image-loader.ts',
};

export default nextConfig as NextConfig;
