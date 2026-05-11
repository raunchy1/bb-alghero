'use client'

import { motion, useInView } from 'framer-motion'
import { ReactNode, useRef } from 'react'

type AnimationType =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scale'
  | 'scaleUp'
  | 'rotateIn'
  | 'blurIn'
  | 'clipReveal'
  | 'float'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  type?: AnimationType
  once?: boolean
  amount?: number
}

const getVariants = (type: AnimationType) => {
  switch (type) {
    case 'fadeUp':
      return { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }
    case 'fadeDown':
      return { hidden: { opacity: 0, y: -40 }, visible: { opacity: 1, y: 0 } }
    case 'fadeLeft':
      return { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } }
    case 'fadeRight':
      return { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } }
    case 'scale':
      return { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }
    case 'scaleUp':
      return { hidden: { opacity: 0, scale: 0.8, y: 40 }, visible: { opacity: 1, scale: 1, y: 0 } }
    case 'rotateIn':
      return { hidden: { opacity: 0, rotateX: -15, y: 40 }, visible: { opacity: 1, rotateX: 0, y: 0 } }
    case 'blurIn':
      return { hidden: { opacity: 0, filter: 'blur(10px)', y: 20 }, visible: { opacity: 1, filter: 'blur(0px)', y: 0 } }
    case 'clipReveal':
      return { hidden: { opacity: 0, clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' }, visible: { opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' } }
    case 'float':
      return { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
    default:
      return { hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0 } }
  }
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  type = 'fadeUp',
  once = true,
  amount = 0.15,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })
  const variants = getVariants(type)

  return (
    <motion.div
      ref={ref}
      initial={variants.hidden}
      animate={isInView ? variants.visible : variants.hidden}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      style={type === 'rotateIn' ? { perspective: '1000px' } : undefined}
    >
      {children}
    </motion.div>
  )
}

// Stagger container for children
export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delay = 0,
  once = true,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delay?: number
  once?: boolean
  amount?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = '',
  type = 'fadeUp',
  duration = 0.7,
}: {
  children: ReactNode
  className?: string
  type?: AnimationType
  duration?: number
}) {
  const variants = getVariants(type)

  return (
    <motion.div
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: { duration, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={className}
      style={type === 'rotateIn' ? { perspective: '1000px' } : undefined}
    >
      {children}
    </motion.div>
  )
}

// Parallax wrapper
export function ParallaxLayer({
  children,
  className = '',
  speed = 0.5,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ willChange: 'transform' }}
      initial={{ y: 0 }}
      animate={isInView ? { y: speed * -30 } : {}}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
    >
      {children}
    </motion.div>
  )
}

// Magnetic hover effect wrapper
export function MagneticHover({
  children,
  className = '',
  strength = 0.3,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    ref.current.style.transform = `translate(${x}px, ${y}px)`
  }

  const handleMouseLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {children}
    </div>
  )
}
