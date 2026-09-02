import HeartDottedText from '@/components/HeartDottedText'

const bookingUrl = 'https://book.cuddlesapp.com/kennedi-grooming-studio'
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
        <div className="footer-nav-column">
          <nav className="footer-nav-grid" aria-label="Footer navigation">
            {navigation.map(([label, href]) => <a href={href} key={label}>{label}</a>)}
          </nav>
        </div>

        <div>
          <h2>Contact Me</h2>
          <ul className="footer-contact-list">
            <li>Fort Worth, TX 76177</li>
            <li><a href="tel:+16823467561">+1 682-346-7561</a></li>
            <li><a href="mailto:kennedigroomingstudio@gmail.com">kennedigroomingstudio@gmail.com</a></li>
          </ul>
          <div className="social-links">
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">◎</a>
            <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok">♪</a>
          </div>
        </div>

        <div>
          <h2>Studio Hours</h2>
          <ul className="hours-list">
            <li><span>Monday</span><span>Closed</span></li>
            <li><span>Tue - Fri</span><span>8:00 AM - 5:00 PM</span></li>
            <li><span>Saturday</span><span>9:00 AM - 3:00 PM</span></li>
            <li><span>Sunday</span><span>Closed</span></li>
            <li><span>Holidays</span><span>Closed</span></li>
          </ul>
        </div>

        <div>
          <h2>Newsletter</h2>
          <p className="newsletter-copy">Sign up for monthly updates &amp; events!</p>
          <a className="button button-primary footer-booking" href={newsletterUrl} target="_blank" rel="noopener noreferrer">Sign Up for Updates</a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-identity">
          <HeartDottedText as="span" lightText>Kennedi&apos;s Grooming Studio</HeartDottedText>
          <span>Kennedi&apos;s Grooming Studio © 2026 All Rights Reserved</span>
        </div>
        <span><a href="/#terms">Terms of Service</a><a href="/#terms">Privacy Policy</a></span>
      </div>
    </footer>
  )
}
