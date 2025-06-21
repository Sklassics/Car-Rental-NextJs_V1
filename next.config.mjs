/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['127.0.0.1', 'localhost'],
    unoptimized: true,
  },
  experimental: {
    appDir: true,
  },
}

export default nextConfig
