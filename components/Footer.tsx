import HeartDottedText from '@/components/HeartDottedText'

const facebookUrl = 'https://www.facebook.com/share/1BSPxkWixU/?mibextid=wwXIfr'
const instagramUrl = 'https://www.instagram.com/kennedigroomingstudio?igsh=dmxzMjIybHRrZW9p&utm_source=qr'
const tiktokUrl = 'https://www.tiktok.com/@kennedigroomingstudio?_r=1&_t=ZP-97ZC0g5Rl0g'
const newsletterUrl = 'https://manage.kmail-lists.com/subscriptions/subscribe?a=Uq72HT&g=QZTtfF'

const navigation = [
  ['Home', '/#home'],
  ['About', '/#about'],
  ['Dog Grooming', '/#dog-grooming'],
  ['FAQ', '/#faq'],
  ['Cat Grooming', '/#cat-grooming'],
  ['Policy', '/#terms'],
  ['Gallery', '/#gallery'],
  ['Reviews', '/#reviews'],
] as const

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-nav-column" style={{ paddingTop: '40px' }}>
          <nav className="footer-nav-grid" aria-label="Footer navigation">
            {navigation.map(([label, href]) => (
              <a key={label} href={href} className="hover:text-primary transition-colors">
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div>
          <h2>Contact Me</h2>
          <ul className="footer-contact-list">
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: 14, height: 14, flexShrink: 0 }} className="fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <path d="M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
              </svg>
              <span>Fort Worth, TX 76177</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: 14, height: 14, flexShrink: 0 }} className="fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:16823467661">(682) 346-7661</a>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg style={{ width: 14, height: 14, flexShrink: 0 }} className="fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 4.99L4 6h16zm0 12H4V8l8 5 8-5v10z" />
              </svg>
              <a href="mailto:kennedigroomingstudio@gmail.com" style={{ textTransform: 'lowercase', letterSpacing: 'normal', fontSize: '11px' }}>
                kennedigroomingstudio@gmail.com
              </a>
            </li>
          </ul>
          <div className="social-links" style={{ marginTop: '24px' }}>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg style={{ width: 18, height: 18 }} className="fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg style={{ width: 18, height: 18 }} className="fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zM12 16c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zM18.406 4.155c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <svg style={{ width: 18, height: 18 }} className="fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h2>Studio Hours</h2>
          <ul className="hours-list">
            <li>
              <span>Monday</span>
              <span>Closed</span>
            </li>
            <li>
              <span>Tue - Fri</span>
              <span>8:00 AM - 5:00 PM</span>
            </li>
            <li>
              <span>Saturday</span>
              <span>9:00 AM - 3:00 PM</span>
            </li>
            <li>
              <span>Sunday</span>
              <span>Closed</span>
            </li>
            <li>
              <span>Holidays</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>

        <div>
          <h2>Newsletter</h2>
          <p className="newsletter-copy">Sign up for monthly updates &amp; events!</p>
          <a className="button button-primary footer-booking" href={newsletterUrl} target="_blank" rel="noopener noreferrer">
            Sign Up for Updates
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-identity">
          <HeartDottedText as="span" lightText className="font-display text-white">
            Kennedi&apos;s Grooming Studio
          </HeartDottedText>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.40)', fontWeight: 700, letterSpacing: '0.1em' }}>Kennedi&apos;s Grooming Studio © 2026 All Rights Reserved</span>
        </div>
        <span style={{ display: 'flex', gap: '24px', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
          <a href="/#terms" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Terms of Service
          </a>
          <a href="/#terms" style={{ color: 'rgba(255,255,255,0.40)' }}>
            Privacy Policy
          </a>
        </span>
      </div>
    </footer>
  )
}
