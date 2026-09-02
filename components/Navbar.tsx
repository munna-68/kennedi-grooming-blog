'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const bookingUrl = 'https://book.cuddlesapp.com/kennedi-grooming-studio'

const links = [
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
    return () => document.body.classList.remove('nav-open')
  }, [menuOpen])

  return (
    <header className={`navbar${scrolled ? ' navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <img src="/blog/logo-v2.png" alt="Kennedi's Grooming Studio logo" />
          <span className="navbar-lockup">
            <span className="navbar-brand">Kennedi&apos;s Grooming Studio</span>
            <span className="navbar-tagline">1:1 Professional Pet Grooming</span>
          </span>
        </a>

        <nav className="navbar-desktop" aria-label="Main navigation">
          {links.map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <Link href="/" className="navbar-active" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
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

      <div id="mobile-navigation" className={`navbar-mobile${menuOpen ? ' open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {links.map(([label, href]) => (
            <a href={href} key={label} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
          <Link href="/" className="navbar-active" onClick={() => setMenuOpen(false)}>
            Blog
          </Link>
          <a className="button button-dark navbar-mobile-cta" href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
            Book Appointment
          </a>
        </nav>
      </div>
    </header>
  )
}
