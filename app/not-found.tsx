import Link from 'next/link'
import HeartDottedText from '@/components/HeartDottedText'

export default function NotFound() {
  return (
    <section className="not-found page-container">
      <div className="not-found-code" aria-hidden="true">404</div>
      <p className="eyebrow">This page wandered off</p>
      <HeartDottedText as="h1">No story here.</HeartDottedText>
      <p>I couldn&apos;t find that story, but there&apos;s plenty more good care to discover.</p>
      <Link href="/" className="button button-dark">Back to the journal</Link>
    </section>
  )
}
