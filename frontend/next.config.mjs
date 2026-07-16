/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'business.auts.ac.in',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'blog.auts.ac.in',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'workbiz.auts.ac.in',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'auts.ac.in',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;
