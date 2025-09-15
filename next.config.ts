import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // İngilizce kategori URL'lerini Türkçe'ye yönlendir
  async redirects() {
    return [
      {
        source: '/category/rings',
        destination: '/kategori/yuzukler',
        permanent: true,
      },
      {
        source: '/category/necklaces',
        destination: '/kategori/kolyeler',
        permanent: true,
      },
      {
        source: '/category/earrings',
        destination: '/kategori/kupeler',
        permanent: true,
      },
      {
        source: '/category/bracelets',
        destination: '/kategori/bilezikler',
        permanent: true,
      },
      {
        source: '/category/collections',
        destination: '/kategori/koleksiyonlar',
        permanent: true,
      },
      // Genel category redirect'i
      {
        source: '/category/:slug*',
        destination: '/kategori/:slug*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
