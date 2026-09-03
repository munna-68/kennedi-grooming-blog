'use client'

import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function BlogMotion() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const reveal = (selector: string, y: number, duration: number, start: string) => {
        gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
          const delay = Number.parseFloat(getComputedStyle(element).getPropertyValue('--delay')) || 0
          if (reducedMotion) {
            gsap.set(element, { opacity: 1, y: 0, scale: 1 })
            return
          }

          gsap.fromTo(
            element,
            { opacity: 0, y, scale: selector === '.reveal-image' ? 0.98 : 1 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              delay,
              duration,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: element,
                start,
                toggleActions: 'play none none none',
              },
            },
          )
        })
      }

      reveal('.reveal', 18, 0.65, 'top 96%')
      reveal('.reveal-text', 18, 0.65, 'top 92%')
      reveal('.reveal-image', 22, 0.8, 'top 90%')
      reveal('.reveal-card', 20, 0.6, 'top 94%')
      ScrollTrigger.refresh()
    }, document.body)

    // Font swaps + late images shift layout after triggers are measured —
    // re-measure so above-the-fold reveals can't get stuck hidden.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(() => requestAnimationFrame(refresh))
    window.addEventListener('load', refresh)
    // Safety net: if anything above the fold is still hidden after load
    // (e.g. a miscalculated trigger), reveal it instead of leaving a gap.
    const safety = window.setTimeout(() => {
      gsap.utils.toArray<HTMLElement>('.reveal, .reveal-text').forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight && getComputedStyle(el).opacity === '0') {
          gsap.set(el, { opacity: 1, y: 0, scale: 1 })
        }
      })
      ScrollTrigger.refresh()
    }, 2500)

    return () => {
      window.removeEventListener('load', refresh)
      window.clearTimeout(safety)
      context.revert()
    }
  }, [pathname])

  return null
}
