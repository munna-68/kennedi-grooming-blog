/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/blog',
  async redirects() {
    return [
      {
        source: '/api/image',
        destination: '/blog/api/image',
        permanent: false,
        basePath: false,
      },
    ]
  },
}

export default nextConfig
