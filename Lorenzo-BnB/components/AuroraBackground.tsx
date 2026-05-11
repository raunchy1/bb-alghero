'use client'

import { ReactNode } from 'react'

interface AuroraBackgroundProps {
  children?: ReactNode
  className?: string
}

export default function AuroraBackground({ children, className = '' }: AuroraBackgroundProps) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Aurora layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] animate-border-dance opacity-20"
          style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0%, oklch(58% 0.12 42 / 0.15) 25%, transparent 50%, oklch(52% 0.13 240 / 0.1) 75%, transparent 100%)',
            filter: 'blur(80px)',
          }}
        />
        <div 
          className="absolute -top-[30%] -right-[30%] w-[150%] h-[150%] animate-border-dance opacity-10"
          style={{
            background: 'radial-gradient(circle at 50% 50%, oklch(58% 0.12 42 / 0.2), transparent 70%)',
            filter: 'blur(60px)',
            animationDirection: 'reverse',
            animationDuration: '8s',
          }}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
