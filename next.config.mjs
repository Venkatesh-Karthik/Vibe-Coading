/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['picsum.photos', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    // Fix for firebase/undici private class fields issue
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Transpile firebase packages to fix the private class fields issue
  transpilePackages: ['firebase', 'undici'],
};

export default nextConfig;
