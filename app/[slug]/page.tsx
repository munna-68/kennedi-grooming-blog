import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CtaBand from '@/components/CtaBand'
import HeartDottedText from '@/components/HeartDottedText'
import JsonLd from '@/components/JsonLd'
import { formatDate, getPostBySlug, getPublishedPosts, isNotionS3Url, siteUrl } from '@/lib/notion'

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts()
    return posts.map((post) => ({ slug: post.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch(() => null)
  if (!post) return { title: 'Story not found' }

  const description = post.excerpt || `A story from Kennedi's Grooming Studio in Fort Worth, TX.`
  const image = post.coverImage
    ? (post.coverImage.startsWith('http') ? post.coverImage : `${siteUrl}${post.coverImage}`)
    : `${siteUrl}/blog/og-image.jpg`

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      url: `/blog/${post.slug}`,
      title: post.title,
      description,
      publishedTime: post.publishedDate ?? undefined,
      authors: ['Kennedi Sherralle'],
      images: [{ url: image, alt: post.title }],
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: [image] },
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug).catch((error) => {
    console.warn(`BlogPost: could not fetch ${slug} from Notion.`, error)
    return null
  })
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedDate ?? undefined,
    dateModified: post.publishedDate ?? undefined,
    url: `${siteUrl}/blog/${post.slug}`,
    image: post.coverImage
      ? [post.coverImage.startsWith('http') ? post.coverImage : `${siteUrl}${post.coverImage}`]
      : [`${siteUrl}/blog/og-image.jpg`],
    author: { '@type': 'Person', name: 'Kennedi Sherralle', url: siteUrl },
    publisher: { '@type': 'Organization', name: "Kennedi's Grooming Studio", url: siteUrl, logo: { '@type': 'ImageObject', url: `${siteUrl}/blog/logo-v2.png` } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${post.slug}` },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="article-page">
        <header className="article-hero page-container">
          <Link href="/" className="article-back reveal-text"><span aria-hidden="true">←</span> Back to stories</Link>
          <div className="article-kicker reveal-text"><span className="eyebrow">Kennedi&apos;s Grooming Studio</span>{post.tags.map((tag) => <span className="tag-chip" key={tag}>{tag}</span>)}</div>
          <HeartDottedText as="h1" className="article-title reveal-text">{post.title}</HeartDottedText>
          <div className="article-meta reveal-text"><span>{post.publishedDate && formatDate(post.publishedDate)}</span><span aria-hidden="true">·</span><span>{post.readingTime} min read</span></div>
          <div className="article-divider reveal-text" aria-hidden="true"><span>♡</span></div>
          {post.coverImage && <div className="article-cover reveal-image"><img src={post.coverImage} alt={post.title} /></div>}
        </header>

        <div className="article-body reveal-text">
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ node: _node, ...props }) => {
                  const rawSrc = typeof props.src === 'string' ? props.src : ''
                  let src = props.src
                  if (rawSrc.startsWith('/api/image')) {
                    src = `/blog${rawSrc}`
                  } else if (isNotionS3Url(rawSrc)) {
                    src = `/blog/api/image?url=${encodeURIComponent(rawSrc)}`
                  }
                  return <img {...props} src={src} alt={props.alt ?? ''} loading="lazy" />
                },
                a: ({ node: _node, ...props }) => <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined} />,
              }}
            >
              {post.markdown}
            </ReactMarkdown>
          </div>
        </div>
      </article>
      <div className="page-container"><CtaBand /></div>
    </>
  )
}
