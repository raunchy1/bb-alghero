'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  life: number
  maxLife: number
}

interface AmbientParticlesProps {
  className?: string
  count?: number
  color?: string
  minSize?: number
  maxSize?: number
  speed?: number
}

export default function AmbientParticles({
  className = '',
  count = 40,
  color = '255, 215, 180',
  minSize = 1,
  maxSize = 3,
  speed = 0.3,
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: minSize + Math.random() * (maxSize - minSize),
      speedX: (Math.random() - 0.5) * speed,
      speedY: -(Math.random() * 0.5 + 0.2) * speed,
      opacity: Math.random() * 0.4 + 0.1,
      life: Math.random() * 100,
      maxLife: 200 + Math.random() * 200,
    }))

    const animate = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        p.life++

        if (p.life > p.maxLife || p.y < -10) {
          p.x = Math.random() * canvas.width
          p.y = canvas.height + 10
          p.life = 0
          p.maxLife = 200 + Math.random() * 200
          p.opacity = Math.random() * 0.4 + 0.1
        }

        const lifeRatio = p.life / p.maxLife
        const fadeIn = Math.min(lifeRatio * 5, 1)
        const fadeOut = Math.min((1 - lifeRatio) * 5, 1)
        const alpha = p.opacity * Math.min(fadeIn, fadeOut)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        ctx.fill()
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [count, color, minSize, maxSize, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  )
}
