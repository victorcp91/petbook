/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  transpilePackages: ['@petbook/ui', '@petbook/utils'],
  images: {
    domains: ['localhost', 'supabase.co'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || '',
  },
};

module.exports = withPWA(nextConfig);
