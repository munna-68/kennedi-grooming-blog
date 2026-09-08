import type { MetadataRoute } from 'next'

// Served at /blog/robots.txt on the origin (proxied to
// https://www.kennedigroomingstudio.com/blog/robots.txt).
// The canonical robots.txt lives on the main Vite site, which already
// references both sitemaps — this file only guards the origin host.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://www.kennedigroomingstudio.com/blog/sitemap.xml',
  }
}
