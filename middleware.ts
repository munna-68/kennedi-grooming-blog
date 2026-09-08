import { NextResponse, type NextRequest } from 'next/server'

const CANONICAL_HOST = 'www.kennedigroomingstudio.com'

/**
 * The blog origin (kennedi-grooming-blog.vercel.app) is only ever meant to be
 * consumed through the rewrite on the canonical domain:
 *   https://www.kennedigroomingstudio.com/blog/:path*
 * If Google crawls/indexes the vercel.app host directly it creates duplicate
 * content that splits ranking signals. Tell crawlers to drop any response
 * served from a non-canonical host.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''

  if (host && !host.includes(CANONICAL_HOST)) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
