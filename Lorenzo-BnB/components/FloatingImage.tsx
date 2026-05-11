'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

interface FloatingImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  speed?: number
  direction?: 'up' | 'down'
  sizes?: string
}

export default function FloatingImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  speed = 0.3,
  direction = 'up',
  sizes = '50vw',
}: FloatingImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const multiplier = direction === 'up' ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * multiplier, -100 * speed * multiplier])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.6, 1, 1, 0.6])

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ y, opacity }}
    >
      <motion.div style={{ scale }} className="w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-cover ${imgClassName}`}
          sizes={sizes}
        />
      </motion.div>
    </motion.div>
  )
}
