import type { Metadata } from 'next'
import Link from 'next/link'
import CtaBand from '@/components/CtaBand'
import HeartDottedText from '@/components/HeartDottedText'
import JsonLd from '@/components/JsonLd'
import PostCard from '@/components/PostCard'
import { formatDate, getPublishedPosts, postUrl, siteUrl } from '@/lib/notion'

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Kennedi's Grooming Studio Blog",
  description:
    "Pet care tips, grooming guidance, and stories from Kennedi's Grooming Studio in Fort Worth, TX.",
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    url: '/blog',
    siteName: "Kennedi's Grooming Studio",
    title: "Kennedi's Grooming Studio Blog",
    description:
      "Pet care tips, grooming guidance, and stories from Kennedi's Grooming Studio in Fort Worth, TX.",
    images: [{ url: `${siteUrl}/blog/og-image.jpg`, width: 1200, height: 630, alt: "Kennedi's Grooming Studio" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kennedi's Grooming Studio Blog",
    description:
      "Pet care tips, grooming guidance, and stories from Kennedi's Grooming Studio in Fort Worth, TX.",
    images: [`${siteUrl}/blog/og-image.jpg`],
  },
}

export default async function BlogIndex() {
  const posts = await getPublishedPosts().catch((error) => {
    console.warn('BlogIndex: could not fetch posts from Notion.', error)
    return []
  })
  const [featured, ...rest] = posts

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: "Kennedi's Grooming Studio Blog",
    url: `${siteUrl}/blog`,
    description:
      "Pet care tips, grooming guidance, and stories from Kennedi's Grooming Studio in Fort Worth, TX.",
    isPartOf: { '@type': 'WebSite', name: "Kennedi's Grooming Studio", url: siteUrl },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: postUrl(post.slug),
        name: post.title,
      })),
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="blog-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <span className="hero-paw hero-paw-one" aria-hidden="true">✦</span>
        <span className="hero-paw hero-paw-two" aria-hidden="true">♡</span>
        <div className="hero-content">
          <p className="eyebrow reveal">Kennedi&apos;s Grooming Studio <span aria-hidden="true">·</span> Fort Worth, TX</p>
          <HeartDottedText as="h1" className="reveal" lightText>
            Good care starts <em>here.</em>
          </HeartDottedText>
          <p className="hero-sub reveal">A softer place for pet care tips, grooming know-how, and little notes from my studio.</p>
          <a className="hero-scroll reveal" href="#latest">Explore the journal <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      {posts.length === 0 ? (
        <section className="blog-empty page-container">
          <div className="empty-mark" aria-hidden="true">♡</div>
          <p className="eyebrow">The journal is getting ready</p>
          <HeartDottedText as="h2">Paws in progress.</HeartDottedText>
          <p>I&apos;m working on the first stories now. Check back soon for thoughtful tips on keeping your pet comfortable, healthy, and beautifully cared for.</p>
          <a className="button button-dark" href="https://www.instagram.com/kennedigroomingstudio?igsh=dmxzMjIybHRrZW9p&utm_source=qr" target="_blank" rel="noopener noreferrer">Follow along on Instagram</a>
        </section>
      ) : (
        <>
          {featured && (
            <section id="latest" className="page-container latest-section">
              <div className="section-heading reveal-text">
                <div>
                  <p className="eyebrow">The latest from my studio</p>
                  <HeartDottedText as="h2">Featured story</HeartDottedText>
                </div>
                <span className="section-rule" aria-hidden="true" />
              </div>
              <article className="featured-card reveal-image">
                <Link href={`/${featured.slug}`} className="featured-cover">
                  {featured.coverImage ? <img src={featured.coverImage} alt={featured.title} /> : <div className="cover-placeholder" aria-hidden="true"><span>♡</span></div>}
                  <span className="featured-stamp">Just posted</span>
                </Link>
                <div className="featured-body">
                  <div className="tag-row">{featured.tags.map((tag) => <span className="tag-chip" key={tag}>{tag}</span>)}</div>
                  <h3><Link href={`/${featured.slug}`}>{featured.title}</Link></h3>
                  {featured.excerpt && <p>{featured.excerpt}</p>}
                  <div className="post-card-foot">
                    <span className="post-meta">{featured.publishedDate && formatDate(featured.publishedDate)}</span>
                    <Link href={`/${featured.slug}`} className="read-more">Read the story <span aria-hidden="true">↗</span></Link>
                  </div>
                </div>
              </article>
            </section>
          )}

          {rest.length > 0 && (
            <section className="page-container stories-section">
              <div className="section-heading reveal-text">
                <div>
                  <p className="eyebrow">A little more to explore</p>
                  <HeartDottedText as="h2">More stories</HeartDottedText>
                </div>
                <span className="section-rule" aria-hidden="true" />
              </div>
              <div className="post-grid">
                {rest.map((post, index) => <PostCard key={post.id} post={post} delay={Math.min(index * 0.08, 0.48)} />)}
              </div>
            </section>
          )}
        </>
      )}

      <div className="page-container"><CtaBand /></div>
    </>
  )
}
