import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/accessories',
        destination: '/shop/category/accessories',
        permanent: true,
      },
      {
        source: '/jewels',
        destination: '/shop/category/jewels',
        permanent: true,
      },
      {
        source: '/new-arrivals',
        destination: '/shop',
        permanent: true,
      }
    ]
  }
}

export default nextConfig
