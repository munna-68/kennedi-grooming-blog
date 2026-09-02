import type { MetadataRoute } from 'next'
import { getPublishedPosts, postUrl, siteUrl } from '@/lib/notion'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = []
  try {
    posts = await getPublishedPosts()
  } catch {
    posts = []
  }

  return [
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: postUrl(post.slug),
      lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
