'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage, type Lang } from '@/contexts/LanguageContext'

const navLinks = [
  { label: { it: 'Le Suite', en: 'Suites' }, href: '/rooms' },
  { label: { it: 'Galleria', en: 'Gallery' }, href: '/gallery' },
  { label: { it: 'Esperienze', en: 'Experiences' }, href: '/explore' },
  { label: { it: 'Contatti', en: 'Contact' }, href: '/contact' },
]

const nextLang: Record<Lang, Lang> = { it: 'en', en: 'it' }

// Magnetic button effect
function MagneticButton({ children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)'
  }, [])

  return (
    <a
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      {...props}
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'
  const { lang, setLang, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setIsMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const isTransparent = isHome && !isScrolled

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
          isTransparent
            ? 'bg-transparent'
            : 'bg-[rgba(250,248,244,0.97)] backdrop-blur-[20px] border-b border-[rgba(26,43,60,0.08)]'
        )}
        style={{ height: 90 }}
      >
        <div className="max-w-[1624px] mx-auto px-6 md:px-10 h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo — Left */}
            <Link
              href="/"
              className={clsx(
                'font-serif italic text-[22px] font-light tracking-tight transition-colors duration-300',
                isTransparent ? 'text-white' : 'text-navy'
              )}
            >
              La Suite N4
            </Link>

            {/* Center links — Desktop */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'rolling-link text-[12px] uppercase tracking-[0.3em] font-sans font-medium transition-colors duration-300',
                    isTransparent ? 'text-white/80 hover:text-white' : 'text-navy/60 hover:text-navy',
                    pathname === link.href && (isTransparent ? 'text-white' : 'text-navy')
                  )}
                >
                  <span>{t(link.label)}</span>
                  <span>{t(link.label)}</span>
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-5">
              {/* Language toggle */}
              <button
                onClick={() => setLang(nextLang[lang])}
                className={clsx(
                  'text-[11px] uppercase tracking-[0.2em] font-medium transition-colors duration-300',
                  isTransparent ? 'text-white/60 hover:text-white' : 'text-navy/40 hover:text-navy'
                )}
              >
                {lang === 'it' ? 'EN' : 'IT'}
              </button>

              {/* Prenota button — Desktop */}
              <MagneticButton
                href="/book"
                className={clsx(
                  'magnetic-btn hidden lg:inline-flex items-center justify-center px-7 py-3 text-[12px] font-sans font-medium uppercase tracking-[0.2em] transition-all duration-300',
                  'bg-gold text-white hover:bg-[#b8854e]'
                )}
              >
                {t({ it: 'Prenota', en: 'Book' })}
              </MagneticButton>

              {/* Hamburger — Mobile */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={clsx(
                  'lg:hidden p-1 transition-colors duration-200',
                  isTransparent ? 'text-white' : 'text-navy'
                )}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div className={clsx(
        'fixed inset-0 z-40 flex flex-col bg-navy transition-all duration-500',
        isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      )}>
        <div className="flex items-center justify-between h-[90px] px-6 border-b border-white/10">
          <Link href="/" className="font-serif italic text-[22px] font-light text-white tracking-tight">
            La Suite N4
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="p-1 text-white" aria-label="Close menu">
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center items-center px-8 gap-6">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
              className={clsx(
                'font-serif italic text-4xl text-white/80 hover:text-white transition-colors text-center',
                isMobileOpen ? 'animate-fade-up' : 'opacity-0'
              )}
            >
              {t(link.label)}
            </Link>
          ))}

          <div className="pt-8 mt-4 border-t border-white/10 w-full flex flex-col gap-4 items-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center w-full max-w-xs px-8 py-4 text-[12px] font-medium uppercase tracking-[0.2em] bg-gold text-white"
            >
              {t({ it: 'Prenota ora', en: 'Book now' })}
            </Link>
            <button
              onClick={() => setLang(nextLang[lang])}
              className="text-[13px] uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors"
            >
              {lang === 'it' ? 'English' : 'Italiano'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
