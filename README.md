# Kennedi's Grooming Studio Blog

Standalone Next.js 15 App Router blog backed by a Notion database and served at `/blog` on `kennedigroomingstudio.com`.

## Local development

1. Copy `.env.example` to `.env.local` and fill in the four environment variables.
2. Run `npm install`.
3. Run `npm run dev`.

The local blog runs at `http://localhost:3000/blog`.

## Notion database schema

Use these exact case-sensitive property names and types:

- `Title` — title
- `Slug` — rich_text
- `Status` — select (`Draft` or `Published`)
- `Published Date` — date
- `Excerpt` — rich_text
- `Cover Image` — files & media or url
- `Tags` — multi_select

Only `Published` pages appear publicly.

## Revalidation

- Webhook: `/blog/api/revalidate`
- Manual: `/blog/api/revalidate-manual?secret=REVALIDATE_SECRET`
- One post: `/blog/api/revalidate-manual?secret=REVALIDATE_SECRET&slug=post-slug`

Notion webhooks do not fire for body/block edits. Use the manual endpoint after editing a post body or rely on the hourly ISR regeneration.
