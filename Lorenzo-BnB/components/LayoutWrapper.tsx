'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { LanguageProvider } from '@/contexts/LanguageContext'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import CustomCursor from './CustomCursor'
import PageTransition from './PageTransition'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  const progressRef = useRef<HTMLDivElement>(null)

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // power2 equivalent
      smoothWheel: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Scroll progress
    const handleScroll = () => {
      if (!progressRef.current) return
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      progressRef.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <LanguageProvider>
      {/* Scroll progress bar */}
      <div ref={progressRef} className="scroll-progress" style={{ transform: 'scaleX(0)' }} />

      {/* Film grain overlay */}
      <div className="grain" />

      {/* Custom cursor */}
      <CustomCursor />

      <Navbar />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <WhatsAppButton />
    </LanguageProvider>
  )
}
