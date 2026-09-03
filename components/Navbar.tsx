'use client'

import { useEffect, useState } from 'react'
import HeartDottedText from '@/components/HeartDottedText'

const bookingUrl = 'https://book.cuddlesapp.com/kennedi-grooming-studio'

const desktopLinks = [
  ['Home', '/#home'],
  ['About', '/#about'],
  ['Dog Grooming', '/#dog-grooming'],
  ['Cat Grooming', '/#cat-grooming'],
  ['Gallery', '/#gallery'],
  ['Mobile Grooming', '/#mobile'],
  ['FAQ', '/#faq'],
  ['Reviews', '/#reviews'],
  ['Policy', '/#terms'],
] as const

type IconName = 'home' | 'about' | 'dog' | 'cat' | 'gallery' | 'faq' | 'reviews' | 'mobile' | 'blog' | 'policy'

function getNavIcon(iconName: IconName) {
  const icons: Record<IconName, React.ReactNode> = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    about: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    dog: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
        <path d="M8 14v.5" />
        <path d="M16 14v.5" />
        <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
      </svg>
    ),
    cat: (
      <svg viewBox="0 0 150.4 153.9" fill="none" stroke="currentColor" className="w-6 h-6 text-[#4A5D4A]">
        <path d="m132 64c-0.1-0.3-0.2-0.6-0.1-0.9 1.1-7.1 4.1-28.6-1.8-45.8-0.7-2.1-2.4-4.1-4.6-3.6-3.2 0.7-13.2 7.4-21.9 15.3l-6 5.6c-0.9 0.9-0.8 1-2.2 0.7-3.3-0.6-10.7-2.1-20.3-2.2h-0.2c-8.7 0.1-15.5 1.3-19.2 2.1-1.9 0.4-1.8 0.1-2.8-0.8l-4.8-4.5c-8.8-7.9-18-14.5-22.2-15.9-3.4-0.9-4.7 1.4-5.5 3.6-5.4 15.7-3.9 34.9-2.2 46.3l-2.9 7.8c-1.9 5.5-2.8 11.3-2.7 18.1s1.5 9.9 2.2 12.4c2.3 6.8 6 12.9 11 18.1 5.7 5.9 12.3 10.4 19.7 13.4 7.9 3.4 17.3 6 29.6 6h0.4c7.8 0 16.9-0.8 26-4 13.4-4.5 23.4-12 29.5-21.9 4.2-6.6 6.4-14.8 6.6-22.8 0-7.1-1.4-14.2-4-21l-1.6-4v-2z" strokeWidth="9.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m62.7 76.3c0 2.9-1.9 5.7-4.5 5.8s-4.7-2.7-4.7-5.9c0-2.8 2-5.9 4.6-5.9 2.6 0.2 4.7 2.6 4.6 6" fill="currentColor" stroke="none" />
        <path d="m96.7 76.3c0 2.9-1.9 5.7-4.4 5.8-2.6 0.2-4.7-2.7-4.7-5.8 0-3 1.9-5.6 4.6-6 2.4 0.2 4.6 2 4.5 6" fill="currentColor" stroke="none" />
      </svg>
    ),
    gallery: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    faq: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    reviews: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    mobile: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v8c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        <path d="M9 17h6" />
        <path d="M14 10h4l1 3H14v-3z" />
      </svg>
    ),
    blog: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="7" x2="16" y2="7" />
        <line x1="9" y1="11" x2="16" y2="11" />
        <line x1="9" y1="15" x2="13" y2="15" />
      </svg>
    ),
    policy: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#4A5D4A]">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  }
  return icons[iconName]
}

const mobileLinks: Array<[string, string, IconName]> = [
  ['Home', '/#home', 'home'],
  ['About', '/#about', 'about'],
  ['Dog Grooming', '/#dog-grooming', 'dog'],
  ['Cat Grooming', '/#cat-grooming', 'cat'],
  ['Gallery', '/#gallery', 'gallery'],
  ['Mobile Grooming', '/#mobile', 'mobile'],
  ['FAQ', '/#faq', 'faq'],
  ['Reviews', '/#reviews', 'reviews'],
  ['Policy', '/#terms', 'policy'],
  ['Blog', '/blog', 'blog'],
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen)
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.classList.remove('nav-open')
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          <a href="/#home" className="navbar-logo" onClick={() => setMenuOpen(false)}>
            <img src="/blog/logo-v2.png" alt="Kennedi's Grooming Studio logo" width={185} height={240} />
            <span className="navbar-lockup">
              <HeartDottedText as="span" className="navbar-brand">
                Kennedi&apos;s Grooming Studio
              </HeartDottedText>
              <span className="navbar-tagline">1:1 Professional Pet Grooming</span>
            </span>
          </a>

          <nav className="navbar-desktop" aria-label="Main navigation">
            {desktopLinks.map(([label, href]) => (
              <a href={href} key={label} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            {/* Blog — no underline, same muted tone as main site */}
            <a href="/blog" onClick={() => setMenuOpen(false)}>
              Blog
            </a>
          </nav>

          <div className="navbar-actions">
            <a className="button button-dark navbar-cta" href={bookingUrl} target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
            <button
              className={`navbar-toggle${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* backdrop */}
      <div
        aria-hidden="true"
        className={`navbar-backdrop${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        style={{ display: menuOpen ? undefined : 'none' }}
      />

      {/* premium mobile drawer — mirrors main site exactly */}
      <div id="mobile-navigation" className={`navbar-mobile${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="navbar-mobile-top">
          <nav className="navbar-mobile-grid" aria-label="Mobile navigation">
            {mobileLinks.map(([label, href, icon]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`navbar-mobile-item${label === 'Mobile Grooming' ? ' col-span-2 mx-auto w-full max-w-[50%]' : ''}`}
              >
                <div className="navbar-mobile-item-row">
                  <span className="navbar-mobile-icon" aria-hidden="true">
                    {getNavIcon(icon)}
                  </span>
                  <span className="navbar-mobile-label">{label}</span>
                </div>
                <span className="navbar-mobile-dash" aria-hidden="true" />
              </a>
            ))}
          </nav>
        </div>

        <div className="navbar-mobile-bottom">
          <div className="navbar-mobile-glow navbar-mobile-glow-one" aria-hidden="true" />
          <div className="navbar-mobile-glow navbar-mobile-glow-two" aria-hidden="true" />
          <div aria-hidden="true" className="absolute left-20 bottom-24 opacity-30">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="1.5">
              <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
            </svg>
          </div>
          <div aria-hidden="true" className="absolute right-24 bottom-28 opacity-25">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#8B7355" strokeWidth="1.5">
              <path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z" />
            </svg>
          </div>
          <p className="navbar-mobile-script">We care like family.</p>
          <p className="navbar-mobile-kicker">SAFE · CLEAN · LOVING</p>
          <a className="navbar-mobile-cta" href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            BOOK NOW
          </a>
        </div>
      </div>
    </>
  )
}
