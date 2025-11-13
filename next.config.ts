const withPWA = require('next-pwa')({
  dest: 'public',       
  register: true,     
  skipWaiting: true,  
  disable: process.env.NODE_ENV === 'development',
  scope: '/',
  sw: 'sw.js',
  buildExcludes: [/middleware-manifest\.json$/], 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);