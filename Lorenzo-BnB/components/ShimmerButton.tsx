'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface ShimmerButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  className?: string
  shimmerColor?: string
}

export default function ShimmerButton({
  children,
  href,
  onClick,
  className = '',
  shimmerColor = 'rgba(255,255,255,0.2)',
}: ShimmerButtonProps) {
  const baseClasses = `
    relative overflow-hidden inline-flex items-center justify-center
    px-10 py-5 text-sm font-sans uppercase tracking-[0.2em]
    bg-gold text-white transition-all duration-500
    group
  `

  const shimmerStyle = {
    '--shimmer-color': shimmerColor,
  } as React.CSSProperties

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/5" />
    </>
  )

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${className}`} style={shimmerStyle}>
        {content}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`} style={shimmerStyle}>
      {content}
    </button>
  )
}
