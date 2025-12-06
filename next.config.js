/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
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
  // Enable static exports if needed for simple hosting
  // output: 'export',
};

module.exports = nextConfig;
