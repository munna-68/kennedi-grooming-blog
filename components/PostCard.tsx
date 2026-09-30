import Link from 'next/link'
import type { BlogPostMeta } from '@/lib/notion'
import { formatDate } from '@/lib/notion'

export default function PostCard({ post, delay = 0 }: { post: BlogPostMeta; delay?: number }) {
  const coverSrc = post.coverImage?.startsWith('/api/image') ? `/blog${post.coverImage}` : post.coverImage
  return (
    <article className="post-card reveal-card" style={{ '--delay': `${delay}s` } as React.CSSProperties}>
      <Link href={`/${post.slug}`} aria-label={post.title}>
        <div className="post-card-cover">
          {coverSrc ? (
            <img src={coverSrc} alt={post.title} loading="lazy" />
          ) : (
            <div className="cover-placeholder" aria-hidden="true"><span>♡</span></div>
          )}
          {post.tags[0] && <span className="tag-chip">{post.tags[0]}</span>}
        </div>
        <div className="post-card-body">
          <h3>{post.title}</h3>
          {post.excerpt && <p>{post.excerpt}</p>}
          <div className="post-card-foot">
            <span className="post-meta">{post.publishedDate && formatDate(post.publishedDate)}</span>
            <span className="read-more">Read <span aria-hidden="true">↗</span></span>
          </div>
        </div>
      </Link>
    </article>
  )
}
