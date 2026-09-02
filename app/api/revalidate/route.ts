import { createHmac, timingSafeEqual } from 'crypto'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { getPostMetaById } from '@/lib/notion'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  let body: any
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  if (body?.verification_token && !body?.type) {
    console.log(
      `[notion-webhook] Subscription verification. Paste this token into the Notion Verify dialog and set NOTION_WEBHOOK_SECRET: ${body.verification_token}`,
    )
    return NextResponse.json({
      ok: true,
      message: 'Verification token received. Copy it from the function logs into Notion.',
    })
  }

  const secret = process.env.NOTION_WEBHOOK_SECRET
  if (secret) {
    const signature = request.headers.get('x-notion-signature') ?? ''
    const expected = `sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`
    const valid =
      signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

    if (!valid) return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 401 })
  }

  const type: string = body?.type ?? ''
  const pageId: string | undefined = body?.entity?.id ?? body?.data?.id ?? body?.page_id ?? body?.id

  try {
    revalidatePath('/')
    revalidatePath('/blog')

    let slug: string | null = null
    if (pageId && type.startsWith('page.')) {
      const meta = await getPostMetaById(pageId).catch(() => null)
      slug = meta?.slug ?? null
      if (slug) {
        revalidatePath(`/${slug}`)
        revalidatePath(`/blog/${slug}`)
      }
    }

    console.log(`[notion-webhook] ${type} → revalidated index${slug ? ` and /blog/${slug}` : ''}`)
    return NextResponse.json({ ok: true, type, slug })
  } catch (error) {
    console.error('[notion-webhook] revalidation failed', error)
    return NextResponse.json({ ok: false, error: 'Revalidation failed' })
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Notion webhook endpoint. POST Notion events here.',
  })
}
