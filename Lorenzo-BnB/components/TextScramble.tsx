'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useInView } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
const SCRAMBLE_CHARS = '░▒▓█▀▄▌▐═║╔╗╚╝╠╣╦╩◄►▲▼○●◘◙♠♣♥♦'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  scrambleOnHover?: boolean
  scrambleOnView?: boolean
  once?: boolean
}

export default function TextScramble({
  text,
  className = '',
  delay = 0,
  duration = 1200,
  scrambleOnHover = false,
  scrambleOnView = true,
  once = true,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: 0.5 })
  const [displayText, setDisplayText] = useState(text)
  const [hasPlayed, setHasPlayed] = useState(false)
  const frameRef = useRef<number>(0)

  const scramble = useCallback(
    (targetText: string, dur: number) => {
      const startTime = Date.now()
      const length = targetText.length

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / dur, 1)
        const revealedCount = Math.floor(progress * length)

        let result = ''
        for (let i = 0; i < length; i++) {
          if (targetText[i] === ' ') {
            result += ' '
          } else if (i < revealedCount) {
            result += targetText[i]
          } else {
            result += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          }
        }

        setDisplayText(result)

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          setDisplayText(targetText)
        }
      }

      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(animate)
    },
    []
  )

  useEffect(() => {
    if (scrambleOnView && isInView && !hasPlayed) {
      const timer = setTimeout(() => {
        scramble(text, duration)
        setHasPlayed(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [isInView, hasPlayed, scramble, text, delay, duration, scrambleOnView])

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const handleMouseEnter = () => {
    if (scrambleOnHover) scramble(text, 600)
  }

  return (
    <span
      ref={ref}
      className={`inline-block font-mono ${className}`}
      onMouseEnter={handleMouseEnter}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {displayText}
    </span>
  )
}
