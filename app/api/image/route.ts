import { NextRequest, NextResponse } from 'next/server'
import { isNotionS3Url, invalidateImageCache, resolveNotionImageUrl } from '@/lib/notion'

export const dynamic = 'force-dynamic'

function sanitizeId(id: string | null | undefined): string | null {
  if (!id) return null
  const cleaned = id.trim().replace(/[^a-zA-Z0-9-]/g, '')
  return cleaned || null
}

const FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" fill="none">
  <rect width="600" height="400" fill="#F4EFEA"/>
  <circle cx="300" cy="180" r="40" fill="#E2D4C8"/>
  <circle cx="260" cy="130" r="18" fill="#E2D4C8"/>
  <circle cx="340" cy="130" r="18" fill="#E2D4C8"/>
  <circle cx="230" cy="170" r="16" fill="#E2D4C8"/>
  <circle cx="370" cy="170" r="16" fill="#E2D4C8"/>
  <text x="300" y="270" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#8C7A6B">Kennedi's Grooming Studio</text>
</svg>`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const pageId = sanitizeId(searchParams.get('pageId'))
  const blockId = sanitizeId(searchParams.get('blockId'))
  const id = sanitizeId(searchParams.get('id'))
  const rawUrl = searchParams.get('url')
  const mode = searchParams.get('mode') ?? 'proxy'
  const hasVersion = !!searchParams.get('v')

  // Validate direct URL if provided to prevent SSRF
  if (rawUrl && !isNotionS3Url(rawUrl)) {
    return NextResponse.json({ error: 'Unauthorized image URL' }, { status: 400 })
  }

  if (!pageId && !blockId && !id && !rawUrl) {
    return NextResponse.json({ error: 'Missing pageId, blockId, id, or url parameter' }, { status: 400 })
  }

  try {
    let resolved = await resolveNotionImageUrl({ pageId, blockId, id, url: rawUrl })
    const accepts = request.headers.get('accept') || ''

    if (!resolved?.url) {
      if (accepts.includes('image')) {
        return new Response(FALLBACK_SVG, {
          status: 404,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=60, s-maxage=60',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // 1. Explicit redirect mode
    if (mode === 'redirect') {
      const maxAge = Math.min(900, Math.max(60, resolved.remainingSeconds ?? 900))
      // Explicitly no stale-while-revalidate for redirects to prevent serving expired S3 signatures
      const cacheControl = `public, max-age=${maxAge}, s-maxage=${maxAge}, no-transform`
      return NextResponse.redirect(resolved.url, {
        status: 307,
        headers: {
          'Cache-Control': cacheControl,
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // 2. Default: Proxy mode (streams image bytes and enables Edge CDN caching)
    let upstream = await fetch(resolved.url)

    // If upstream returns 401 or 403, cached URL expired. Invalidate and retry once with fresh URL.
    if ((upstream.status === 401 || upstream.status === 403) && (pageId || blockId || id)) {
      invalidateImageCache(pageId || blockId || id || undefined)
      resolved = await resolveNotionImageUrl({ pageId, blockId, id, skipCache: true })
      if (resolved?.url) {
        upstream = await fetch(resolved.url)
      }
    }

    if (!upstream.ok) {
      if (accepts.includes('image')) {
        return new Response(FALLBACK_SVG, {
          status: upstream.status,
          headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=60, s-maxage=60',
            'Access-Control-Allow-Origin': '*',
          },
        })
      }
      return NextResponse.json({ error: 'Upstream image fetch failed' }, { status: upstream.status })
    }

    // ETag handling for conditional 304 requests
    const etag = upstream.headers.get('etag')
    const ifNoneMatch = request.headers.get('if-none-match')
    if (etag && ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg'
    const cacheControl = hasVersion
      ? 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'
      : 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400'

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': cacheControl,
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': 'inline',
    })

    const contentLength = upstream.headers.get('content-length')
    if (contentLength) headers.set('Content-Length', contentLength)
    if (etag) headers.set('ETag', etag)

    if (request.method === 'HEAD') {
      return new Response(null, { status: 200, headers })
    }

    return new Response(upstream.body, {
      status: 200,
      headers,
    })
  } catch (error: any) {
    console.error('[image-proxy] Failed to resolve image:', error)
    const accepts = request.headers.get('accept') || ''
    if (accepts.includes('image')) {
      return new Response(FALLBACK_SVG, {
        status: error?.code === 'object_not_found' ? 404 : 500,
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
    if (error?.code === 'object_not_found') {
      return NextResponse.json({ error: 'Notion object not found' }, { status: 404 })
    }
    return NextResponse.json(
      { error: error?.message || 'Failed to retrieve image' },
      { status: 500 }
    )
  }
}

export async function HEAD(request: NextRequest) {
  return GET(request)
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
