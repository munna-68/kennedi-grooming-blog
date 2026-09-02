'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { ElementType } from 'react'

type Position = { left: number; top: number; size: number }

export default function HeartDottedText({
  as: Tag = 'h1',
  children,
  className = '',
  lightText = false,
}: {
  as?: ElementType
  children: React.ReactNode
  className?: string
  lightText?: boolean
}) {
  const containerRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const [hearts, setHearts] = useState<Position[]>([])

  const measure = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const positions: Position[] = []
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    let node: Node | null

    while ((node = walker.nextNode())) {
      const text = node.textContent ?? ''
      for (let index = 0; index < text.length; index += 1) {
        if (text[index] !== 'i') continue
        const range = document.createRange()
        range.setStart(node, index)
        range.setEnd(node, index + 1)
        const rect = range.getBoundingClientRect()
        if (!rect.width || !rect.height) continue

        const size = rect.height * 0.55
        positions.push({
          left: rect.left + rect.width / 2 - size / 2 - containerRect.left,
          top: rect.top - containerRect.top,
          size,
        })
      }
    }

    setHearts(positions)
  }, [])

  useLayoutEffect(() => {
    measure()
    document.fonts.ready.then(() => requestAnimationFrame(measure))
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(() => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(measure)
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [measure])

  return (
    <Tag ref={containerRef as never} className={`heart-title ${className}`}>
      {children}
      {hearts.map((position, index) => (
        <svg
          key={index}
          aria-hidden="true"
          className="heart-title-mark"
          style={{
            left: position.left,
            top: position.top,
            width: position.size,
            height: position.size,
          }}
          viewBox="0 0 24 24"
        >
          <path
            d="M12 20.7 10.7 19.5C5.9 15.1 2.8 12.3 2.8 8.8A4.7 4.7 0 0 1 7.5 4c1.7 0 3.3.8 4.5 2.1A6 6 0 0 1 16.5 4a4.7 4.7 0 0 1 4.7 4.8c0 3.5-3.1 6.3-7.9 10.7L12 20.7Z"
            fill={lightText ? '#ffffff' : '#000000'}
          />
          <path d="M7.2 10.2c1.2-.8 2.3-1.3 3.2-1.8" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="1.1" />
        </svg>
      ))}
    </Tag>
  )
}
