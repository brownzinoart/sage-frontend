/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use export mode only for Netlify, allow normal build for Railway
  output: process.env.NETLIFY === 'true' ? 'export' : undefined,
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Fix chunk loading issues on Railway
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Fix chunk loading for production builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    return config
  }
}

module.exports = nextConfig