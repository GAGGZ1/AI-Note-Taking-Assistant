// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add other Next.js configuration options here if necessary
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  typescript:{
    ignoreBuildErrors:true,
  },
  eslint:{
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
