const bookingUrl = 'https://book.cuddlesapp.com/kennedi-grooming-studio'

export default function CtaBand() {
  return (
    <section className="cta-band reveal-image">
      <span className="cta-doodle cta-doodle-one" aria-hidden="true">✦</span>
      <span className="cta-doodle cta-doodle-two" aria-hidden="true">♡</span>
      <p className="eyebrow">Fort Worth · 1:1 care · By appointment</p>
      <h2>Ready for a little <em>more</em> care?</h2>
      <p className="cta-copy">I&apos;ll take care of your pet from hello to pickup, with the same calm, personal attention every visit.</p>
      <div className="cta-actions">
        <a className="button button-dark" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book Appointment</a>
        <a className="phone-link" href="tel:16823467661">(682) 346-7661</a>
      </div>
    </section>
  )
}
