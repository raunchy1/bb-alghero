'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import Image from 'next/image'

interface ImageRevealProps {
  src?: string
  alt?: string
  className?: string
  imgClassName?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  once?: boolean
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  quality?: number
  overlayColor?: string
  children?: ReactNode
}

export default function ImageReveal({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  direction = 'up',
  delay = 0,
  duration = 1,
  once = true,
  sizes = '100vw',
  fill = true,
  width,
  height,
  priority = false,
  quality = 85,
  overlayColor = 'var(--color-ink)',
  children,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.2 })

  const clipPathMap = {
    up: {
      hidden: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      visible: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
    },
    down: {
      hidden: 'polygon(0 0%, 100% 0%, 100% 0%, 0 0%)',
      visible: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
    },
    left: {
      hidden: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
      visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    },
    right: {
      hidden: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      visible: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    },
  }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="relative w-full h-full"
        initial={{ clipPath: clipPathMap[direction].hidden }}
        animate={isInView ? { clipPath: clipPathMap[direction].visible } : {}}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.3 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{
            duration: duration * 1.4,
            delay: delay + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {children ? (
            children
          ) : fill && src ? (
            <Image
              src={src}
              alt={alt}
              fill
              className={`object-cover ${imgClassName}`}
              sizes={sizes}
              priority={priority}
              quality={quality}
            />
          ) : src ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className={`object-cover w-full h-full ${imgClassName}`}
              sizes={sizes}
              priority={priority}
              quality={quality}
            />
          ) : null}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Simpler overlay reveal — a colored block slides away to reveal image
export function OverlayReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  once = true,
  overlayColor = 'var(--color-terra)',
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  overlayColor?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.2 })

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: overlayColor }}
        initial={{ y: 0 }}
        animate={isInView ? { y: '-100%' } : {}}
        transition={{
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1],
        }}
      />
    </div>
  )
}
