'use client'

import { motion, useInView, Variants } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface SplitTextProps {
  children: string
  className?: string
  type?: 'words' | 'chars' | 'lines'
  delay?: number
  staggerDelay?: number
  duration?: number
  once?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

const containerVariants: Variants = {
  hidden: {},
  visible: {},
}

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
  },
}

const charVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 80,
    rotateY: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateY: 0,
  },
}

export default function SplitText({
  children,
  className = '',
  type = 'words',
  delay = 0,
  staggerDelay = 0.04,
  duration = 0.6,
  once = true,
  as: Tag = 'span',
}: SplitTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.3 })

  const variants = type === 'chars' ? charVariants : wordVariants
  const finalStagger = type === 'chars' ? staggerDelay * 0.5 : staggerDelay

  const items = type === 'words'
    ? children.split(' ')
    : type === 'chars'
      ? children.split('')
      : [children]

  return (
    <Tag className={className} style={{ perspective: '1000px' }}>
      <motion.span
        ref={ref}
        className="inline-flex flex-wrap"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        transition={{ staggerChildren: finalStagger, delayChildren: delay }}
        aria-label={children}
      >
        {items.map((item, i) => (
          <span key={i} className="overflow-hidden inline-block" style={{ perspective: '500px' }}>
            <motion.span
              className="inline-block"
              variants={variants}
              transition={{
                duration,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {item === ' ' ? '\u00A0' : item}
              {type === 'words' && i < items.length - 1 ? '\u00A0' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

// Simple fade-up line reveal for paragraphs
export function FadeInLines({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  duration = 0.7,
  once = true,
}: {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  duration?: number
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.2 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function FadeInLine({
  children,
  className = '',
  duration = 0.7,
}: {
  children: ReactNode
  className?: string
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration, ease: [0.16, 1, 0.3, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
