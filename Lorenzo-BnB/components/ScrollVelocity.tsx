'use client'

import { useRef, useEffect, useState, ReactNode } from 'react'

interface ScrollVelocityProps {
  children: ReactNode
  className?: string
  maxSkew?: number
  maxScale?: number
}

export default function ScrollVelocity({
  children,
  className = '',
  maxSkew = 3,
  maxScale = 1.02,
}: ScrollVelocityProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('skewY(0deg) scaleY(1)')
  const lastScrollRef = useRef(0)
  const velocityRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    let currentVelocity = 0

    const handleScroll = () => {
      const currentScroll = window.scrollY
      const delta = currentScroll - lastScrollRef.current
      lastScrollRef.current = currentScroll

      // Smooth velocity
      currentVelocity += (delta - currentVelocity) * 0.1
      velocityRef.current = currentVelocity
    }

    const animate = () => {
      const v = velocityRef.current
      const skew = Math.max(-maxSkew, Math.min(maxSkew, v * 0.15))
      const scale = 1 + Math.abs(v) * 0.0005
      const clampedScale = Math.min(maxScale, scale)

      setTransform(`skewY(${skew}deg) scaleY(${clampedScale})`)

      // Decay velocity
      velocityRef.current *= 0.92

      rafRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [maxSkew, maxScale])

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{ transform, transition: 'transform 0.1s linear' }}
    >
      {children}
    </div>
  )
}
