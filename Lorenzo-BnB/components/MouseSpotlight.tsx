'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

interface MouseSpotlightProps {
  children: ReactNode
  className?: string
  size?: number
  color?: string
  opacity?: number
  interactive?: boolean
}

export default function MouseSpotlight({
  children,
  className = '',
  size = 400,
  color = 'var(--color-terra)',
  opacity = 0.08,
  interactive = true,
}: MouseSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const background = useMotionTemplate`
    radial-gradient(
      ${size}px circle at ${mouseX}px ${mouseY}px,
      ${color},
      transparent ${opacity * 1000}%
    )
  `

  useEffect(() => {
    if (!interactive || !containerRef.current) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }

    const el = containerRef.current
    el.addEventListener('mousemove', handleMouseMove)
    return () => el.removeEventListener('mousemove', handleMouseMove)
  }, [interactive, mouseX, mouseY])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
