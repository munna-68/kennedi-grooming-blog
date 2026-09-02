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

type NotionProperty = Record<string, any>

function getClients() {
  const apiKey = process.env.NOTION_API_KEY
  if (!apiKey) throw new Error('NOTION_API_KEY is not set')

  if (!notionClient) {
    notionClient = new Client({ auth: apiKey })
    markdownClient = new NotionToMarkdown({ notionClient })
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

export function coverFromPage(page: any): string | null {
  const property = page?.properties?.['Cover Image']

  if (property?.type === 'files' && Array.isArray(property.files) && property.files.length > 0) {
    const file = property.files[0]
    if (file?.type === 'file') return file.file?.url ?? null
    if (file?.type === 'external') return file.external?.url ?? null
  }

  if (property?.type === 'url' && typeof property.url === 'string' && property.url) {
    return property.url
  }

  const cover = page?.cover
  if (cover?.type === 'file') return cover.file?.url ?? null
  if (cover?.type === 'external') return cover.external?.url ?? null
  return null
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
