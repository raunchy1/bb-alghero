'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlowTextProps {
  children: ReactNode
  className?: string
  glowColor?: string
  glowIntensity?: number
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div'
  animate?: boolean
}

export default function GlowText({
  children,
  className = '',
  glowColor = 'var(--color-terra)',
  glowIntensity = 0.3,
  as: Tag = 'span',
  animate = true,
}: GlowTextProps) {
  return (
    <motion.span
      className={`relative inline-block ${className}`}
      animate={
        animate
          ? {
              textShadow: [
                `0 0 ${10 * glowIntensity}px ${glowColor}`,
                `0 0 ${30 * glowIntensity}px ${glowColor}`,
                `0 0 ${10 * glowIntensity}px ${glowColor}`,
              ],
            }
          : undefined
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        textShadow: `0 0 ${20 * glowIntensity}px ${glowColor}`,
      }}
    >
      <Tag className="relative z-10">{children}</Tag>
    </motion.span>
  )
}
