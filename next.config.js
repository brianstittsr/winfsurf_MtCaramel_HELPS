/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    // Fix for undici package compatibility
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        buffer: false,
        util: false,
      };
    }
    
    // Exclude problematic packages from bundling
    config.externals = config.externals || [];
    config.externals.push({
      'undici': 'undici',
      'node:crypto': 'crypto',
      'node:stream': 'stream',
    });
    
    return config;
  },
  transpilePackages: ['firebase'],
  swcMinify: true,
}

module.exports = nextConfig
