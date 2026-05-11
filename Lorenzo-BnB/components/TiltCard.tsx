'use client'

import { useRef, useState, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glareOpacity?: number
  scale?: number
  perspective?: number
}

export default function TiltCard({
  children,
  className = '',
  tiltAmount = 8,
  glareOpacity = 0.07,
  scale = 1.02,
  perspective = 1000,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg)')
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height

    const rotateX = (0.5 - y) * tiltAmount * 2
    const rotateY = (x - 0.5) * tiltAmount * 2

    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`)
    setGlarePos({ x: x * 100, y: y * 100 })
  }

  const handleMouseLeave = () => {
    setTransform('rotateX(0deg) rotateY(0deg)')
    setGlarePos({ x: 50, y: 50 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => setIsHovered(true)

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ perspective: `${perspective}px`, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      animate={{ scale: isHovered ? scale : 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="relative w-full h-full"
        style={{
          transform: transform,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {children}
        <div
          className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${isHovered ? glareOpacity : 0}), transparent 60%)`,
            transition: 'background 0.15s ease-out',
          }}
        />
      </div>
    </motion.div>
  )
}
