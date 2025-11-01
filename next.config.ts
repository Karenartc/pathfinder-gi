const withPWA = require('next-pwa')({
  dest: 'public',       
  register: true,     
  skipWaiting: true,  
  disable: process.env.NODE_ENV === 'development',
  scope: '/',
  sw: 'sw.js', // 
  buildExcludes: [/middleware-manifest\.json$/], 
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);