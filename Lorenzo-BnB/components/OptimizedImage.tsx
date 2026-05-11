'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  fill?: boolean
  width?: number
  height?: number
  priority?: boolean
  className?: string
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

// Generate a tiny blur placeholder
function generateBlurPlaceholder(width: number = 8, height: number = 6): string {
  // This creates a simple gray SVG as placeholder
  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#f5f4ef"/></svg>`
  )}`
}

export default function OptimizedImage({
  src,
  alt,
  fill,
  width,
  height,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'blur',
  blurDataURL,
  ...props
}: OptimizedImageProps & Omit<React.ComponentProps<typeof Image>, 'src' | 'alt' | 'fill' | 'width' | 'height' | 'priority' | 'className' | 'sizes' | 'quality' | 'placeholder' | 'blurDataURL'>) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Default blur data URL
  const defaultBlur = blurDataURL || generateBlurPlaceholder()

  // Determine if this is a priority image (above the fold)
  const shouldPriority = priority || src.includes('hero')

  return (
    <div className={`relative overflow-hidden ${fill ? 'h-full w-full' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={shouldPriority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={defaultBlur}
        className={`
          duration-700 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          ${className}
        `}
        onLoad={() => setIsLoaded(true)}
        loading={shouldPriority ? 'eager' : 'lazy'}
        decoding={shouldPriority ? 'sync' : 'async'}
        {...props}
      />
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#f5f4ef] animate-pulse" />
      )}
    </div>
  )
}

// Mobile-optimized image component with different sizes
export function MobileOptimizedImage({
  mobileSrc,
  desktopSrc,
  alt,
  ...props
}: {
  mobileSrc: string
  desktopSrc: string
  alt: string
} & Omit<OptimizedImageProps, 'src'>) {
  return (
    <>
      {/* Mobile image - hidden on desktop */}
      <div className="block md:hidden">
        <OptimizedImage
          src={mobileSrc}
          alt={alt}
          sizes="100vw"
          {...props}
        />
      </div>
      {/* Desktop image - hidden on mobile */}
      <div className="hidden md:block">
        <OptimizedImage
          src={desktopSrc}
          alt={alt}
          sizes="(max-width: 1200px) 50vw, 33vw"
          {...props}
        />
      </div>
    </>
  )
}
