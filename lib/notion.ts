import { Client } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'

export interface BlogPostMeta {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedDate: string | null
  coverImage: string | null
  tags: string[]
}

export interface BlogPost extends BlogPostMeta {
  markdown: string
  readingTime: number
}

export const SITE_URL = 'https://www.kennedigroomingstudio.com'

let notionClient: Client | null = null
let markdownClient: NotionToMarkdown | null = null

export interface CachedImage {
  url: string
  expiresAt: number
}

const imageCache = new Map<string, CachedImage>()

export function isNotionS3Url(url: string | null | undefined): boolean {
  if (!url) return false
  return (
    url.includes('prod-files-secure.s3') ||
    url.includes('file.notion.so') ||
    url.includes('amazonaws.com') ||
    url.includes('X-Amz-Signature') ||
    url.includes('X-Amz-Algorithm')
  )
}

export function parseS3Expiry(url: string): number | null {
  try {
    const parsed = new URL(url)
    const amzDate = parsed.searchParams.get('X-Amz-Date')
    const amzExpires = parsed.searchParams.get('X-Amz-Expires')
    if (amzDate && amzExpires) {
      const year = amzDate.slice(0, 4)
      const month = amzDate.slice(4, 6)
      const day = amzDate.slice(6, 8)
      const hour = amzDate.slice(9, 11)
      const min = amzDate.slice(11, 13)
      const sec = amzDate.slice(13, 15)
      const iso = `${year}-${month}-${day}T${hour}:${min}:${sec}Z`
      const expTime = new Date(iso).getTime() + parseInt(amzExpires, 10) * 1000
      if (!isNaN(expTime)) return expTime
    }
  } catch {}
  return null
}

export function cacheImageUrl(key: string, url: string, expiryTime?: string | null): void {
  if (!key || !url) return
  let expTimestamp: number | null = null
  if (expiryTime) {
    const parsed = new Date(expiryTime).getTime()
    if (!isNaN(parsed)) expTimestamp = parsed
  }
  if (!expTimestamp) {
    expTimestamp = parseS3Expiry(url)
  }

  let expiresAt: number
  if (expTimestamp) {
    // 5-minute safety buffer before expiration, capped at 55 minutes from now
    expiresAt = Math.min(expTimestamp - 5 * 60 * 1000, Date.now() + 55 * 60 * 1000)
  } else {
    // Default 50 minutes for S3 presigned URLs without explicit timestamps
    expiresAt = Date.now() + 50 * 60 * 1000
  }

  // Never cache URLs that are already expired or within 30 seconds of expiry
  if (expiresAt > Date.now() + 30 * 1000) {
    imageCache.set(key, { url, expiresAt })
  }
}

export function getCachedImageUrl(key: string): string | null {
  const item = imageCache.get(key)
  if (!item) return null
  if (Date.now() >= item.expiresAt) {
    imageCache.delete(key)
    return null
  }
  return item.url
}

export function invalidateImageCache(id?: string): void {
  if (!id) {
    imageCache.clear()
    return
  }
  imageCache.delete(`page:${id}`)
  imageCache.delete(`block:${id}`)
}

type NotionProperty = Record<string, any>

function getClients() {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY is not set')

  if (!notionClient) {
    notionClient = new Client({ auth: apiKey })
    markdownClient = new NotionToMarkdown({ notionClient })

    markdownClient.setCustomTransformer('image', async (block: any) => {
      const blockContent = block?.image
      if (!blockContent) return ''

      const imageType = blockContent.type
      const caption =
        blockContent.caption
          ?.map((item: any) => item?.plain_text ?? '')
          .join('')
          .trim() || ''

      const cleanAlt = (caption || 'Image').replace(/[\r\n]+/g, ' ').replace(/[\[\]]/g, '')

      if (imageType === 'file' || isNotionS3Url(blockContent.file?.url) || isNotionS3Url(blockContent.external?.url)) {
        const fileUrl = blockContent.file?.url ?? blockContent.external?.url
        if (block?.id && fileUrl) {
          cacheImageUrl(`block:${block.id}`, fileUrl, blockContent.file?.expiry_time)
        }
        const version = block?.last_edited_time ? `&v=${encodeURIComponent(block.last_edited_time)}` : ''
        return `![${cleanAlt}](/blog/api/image?blockId=${block.id}${version})`
      }

      if (imageType === 'external' && blockContent.external?.url) {
        return `![${cleanAlt}](${blockContent.external.url})`
      }

      return ''
    })
  }

  return { notion: notionClient, n2m: markdownClient! }
}

export function getDatabaseId(): string {
  const databaseId = process.env.NOTION_DATABASE_ID
  if (!databaseId) throw new Error('NOTION_DATABASE_ID is not set')
  return databaseId
}

export function plainText(prop: NotionProperty | undefined): string {
  if (!prop) return ''
  const values = prop.type === 'title' ? prop.title : prop.type === 'rich_text' ? prop.rich_text : null
  if (!Array.isArray(values)) return ''
  return values.map((value: any) => value?.plain_text ?? '').join('').trim()
}

export function titleFromProps(props: Record<string, NotionProperty>): string {
  for (const prop of Object.values(props)) {
    if (prop?.type === 'title') return plainText(prop)
  }
  return ''
}

export function rawCoverFromPage(page: any): { url: string; expiry_time?: string; type: 'file' | 'external' } | null {
  const properties = page?.properties ?? {}

  // 1. Check exact 'Cover Image' or case-insensitive variations like 'cover image', 'Cover', 'Image'
  let property = properties['Cover Image']
  if (!property) {
    const key = Object.keys(properties).find((k) => /^(cover\s*image|cover|image|thumbnail)/i.test(k.trim()))
    if (key) property = properties[key]
  }

  if (property?.type === 'files' && Array.isArray(property.files) && property.files.length > 0) {
    const file = property.files[0]
    if (file?.type === 'file' && file.file?.url) {
      return { url: file.file.url, expiry_time: file.file.expiry_time, type: 'file' }
    }
    if (file?.type === 'external' && file.external?.url) {
      return { url: file.external.url, type: 'external' }
    }
  }

  if (property?.type === 'url' && typeof property.url === 'string' && property.url) {
    return { url: property.url, type: 'external' }
  }

  const cover = page?.cover
  if (cover?.type === 'file' && cover.file?.url) {
    return { url: cover.file.url, expiry_time: cover.file.expiry_time, type: 'file' }
  }
  if (cover?.type === 'external' && cover.external?.url) {
    return { url: cover.external.url, type: 'external' }
  }

  return null
}

export function coverFromPage(page: any): string | null {
  const raw = rawCoverFromPage(page)
  if (!raw) return null

  // If this is a Notion-uploaded file or an S3 presigned URL, route via the permanent image endpoint
  if (raw.type === 'file' || isNotionS3Url(raw.url)) {
    if (page?.id && raw.url) {
      cacheImageUrl(`page:${page.id}`, raw.url, raw.expiry_time)
    }
    const version = page?.last_edited_time ? `&v=${encodeURIComponent(page.last_edited_time)}` : ''
    return `/blog/api/image?pageId=${page.id}${version}`
  }

  return raw.url
}

export function metaFromPage(page: any): BlogPostMeta {
  const properties = page?.properties ?? {}
  const publishedDate = properties['Published Date']

  return {
    id: page.id,
    title: titleFromProps(properties),
    slug: plainText(properties.Slug),
    excerpt: plainText(properties.Excerpt),
    publishedDate: publishedDate?.type === 'date' ? publishedDate.date?.start ?? null : null,
    coverImage: coverFromPage(page),
    tags:
      properties.Tags?.type === 'multi_select'
        ? (properties.Tags.multi_select ?? []).map((tag: any) => tag?.name).filter(Boolean)
        : [],
  }
}

const publishedFilter = { property: 'Status', select: { equals: 'Published' } }
const dateSort = [{ property: 'Published Date', direction: 'descending' as const }]

export async function getPublishedPosts(): Promise<BlogPostMeta[]> {
  const { notion } = getClients()
  const response = await notion.databases.query({
    database_id: getDatabaseId(),
    filter: publishedFilter,
    sorts: dateSort,
  })

  return response.results.map((page: any) => metaFromPage(page)).filter((post) => post.slug)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { notion, n2m } = getClients()
  const response = await notion.databases.query({
    database_id: getDatabaseId(),
    filter: {
      and: [publishedFilter, { property: 'Slug', rich_text: { equals: slug } }],
    },
    page_size: 1,
  })

  const page = response.results[0] as any
  if (!page) return null

  const meta = metaFromPage(page)
  const blocks = await n2m.pageToMarkdown(page.id)
  const markdown = n2m.toMarkdownString(blocks).parent ?? ''

  return { ...meta, markdown, readingTime: estimateReadingTime(markdown) }
}

export async function getPostMetaById(pageId: string): Promise<BlogPostMeta | null> {
  const { notion } = getClients()
  try {
    const page = await notion.pages.retrieve({ page_id: pageId })
    return metaFromPage(page)
  } catch {
    return null
  }
}

export function estimateReadingTime(markdown: string): number {
  const words = markdown
    .replace(/[#>*`\-_[\]()!]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function postUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`
}

export const siteUrl = SITE_URL

export function extractUrlFromBlock(block: any): { url: string; expiry_time?: string } | null {
  if (!block || !block.type) return null
  const type = block.type
  const content = block[type]
  if (!content) return null

  if (content.type === 'file' && content.file?.url) {
    return { url: content.file.url, expiry_time: content.file.expiry_time }
  }
  if (content.type === 'external' && content.external?.url) {
    return { url: content.external.url }
  }
  if (type === 'callout' && content.icon) {
    if (content.icon.type === 'file' && content.icon.file?.url) {
      return { url: content.icon.file.url, expiry_time: content.icon.file.expiry_time }
    }
    if (content.icon.type === 'external' && content.icon.external?.url) {
      return { url: content.icon.external.url }
    }
  }
  return null
}

export async function resolveNotionImageUrl(params: {
  pageId?: string | null
  blockId?: string | null
  id?: string | null
  url?: string | null
  skipCache?: boolean
}): Promise<{ url: string; expiry_time?: string; remainingSeconds?: number } | null> {
  // 1. If direct URL is provided, verify it's an authorized Notion S3/storage URL
  if (params.url && isNotionS3Url(params.url)) {
    const exp = parseS3Expiry(params.url)
    const remaining = exp ? Math.max(60, Math.floor((exp - Date.now()) / 1000)) : 1800
    return { url: params.url, remainingSeconds: remaining }
  }

  const blockId = params.blockId || (params.id && !params.pageId ? params.id : null)
  const pageId = params.pageId || (params.id && !params.blockId ? params.id : null)

  // 2. Check in-memory cache first if not skipping cache
  if (!params.skipCache) {
    if (blockId) {
      const cached = getCachedImageUrl(`block:${blockId}`)
      if (cached) {
        const entry = imageCache.get(`block:${blockId}`)
        const remaining = entry ? Math.max(60, Math.floor((entry.expiresAt - Date.now()) / 1000)) : 1800
        return { url: cached, remainingSeconds: remaining }
      }
    }

    if (pageId) {
      const cached = getCachedImageUrl(`page:${pageId}`)
      if (cached) {
        const entry = imageCache.get(`page:${pageId}`)
        const remaining = entry ? Math.max(60, Math.floor((entry.expiresAt - Date.now()) / 1000)) : 1800
        return { url: cached, remainingSeconds: remaining }
      }
    }
  }

  const { notion } = getClients()

  // 3. If blockId provided, retrieve block from Notion
  if (blockId) {
    try {
      const block = (await notion.blocks.retrieve({ block_id: blockId })) as any
      const extracted = extractUrlFromBlock(block)
      if (extracted?.url) {
        cacheImageUrl(`block:${blockId}`, extracted.url, extracted.expiry_time)
        const entry = imageCache.get(`block:${blockId}`)
        const remaining = entry ? Math.max(60, Math.floor((entry.expiresAt - Date.now()) / 1000)) : 1800
        return { url: extracted.url, expiry_time: extracted.expiry_time, remainingSeconds: remaining }
      }
    } catch (err) {
      if (!params.blockId && pageId) {
        // generic id failed as block, try page next
      } else {
        throw err
      }
    }
  }

  // 4. If pageId provided, retrieve page from Notion
  if (pageId) {
    try {
      const page = (await notion.pages.retrieve({ page_id: pageId })) as any
      const raw = rawCoverFromPage(page)
      if (raw?.url) {
        cacheImageUrl(`page:${pageId}`, raw.url, raw.expiry_time)
        const entry = imageCache.get(`page:${pageId}`)
        const remaining = entry ? Math.max(60, Math.floor((entry.expiresAt - Date.now()) / 1000)) : 1800
        return { url: raw.url, expiry_time: raw.expiry_time, remainingSeconds: remaining }
      }
    } catch (err) {
      throw err
    }
  }

  return null
}

