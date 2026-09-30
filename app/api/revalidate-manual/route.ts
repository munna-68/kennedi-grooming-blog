import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts, invalidateImageCache } from '@/lib/notion'

export const dynamic = 'force-dynamic'

async function handle(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const expected = process.env.REVALIDATE_SECRET

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const slug = searchParams.get('slug')

  try {
    invalidateImageCache()
    revalidatePath('/')
    revalidatePath('/blog')

    if (slug) {
      revalidatePath(`/${slug}`)
      revalidatePath(`/blog/${slug}`)
      return NextResponse.json({ ok: true, revalidated: ['/blog', `/blog/${slug}`] })
    }

    const posts = await getPublishedPosts()
    const revalidated = ['/blog']
    for (const post of posts) {
      revalidatePath(`/${post.slug}`)
      revalidatePath(`/blog/${post.slug}`)
      revalidated.push(`/blog/${post.slug}`)
    }

    return NextResponse.json({ ok: true, revalidated })
  } catch (error) {
    console.error('[revalidate-manual] failed', error)
    return NextResponse.json({ ok: false, error: 'Revalidation failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return handle(request)
}

export async function POST(request: NextRequest) {
  return handle(request)
}
