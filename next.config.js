/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Fix multiple lockfiles warning by setting the workspace root
  outputFileTracingRoot: __dirname,
  // Exclude large image files from serverless function bundles
  outputFileTracingExcludes: {
    '*': [
      './public/images/**',
      './public/images/locations/**',
    ],
  },
};

module.exports = nextConfig;
