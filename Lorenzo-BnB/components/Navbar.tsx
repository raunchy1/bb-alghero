'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage, type Lang } from '@/contexts/LanguageContext'

const AIRBNB_URL = 'https://www.airbnb.it/rooms/1610343576481869093'

const navLinks = [
  { label: { it: 'Home', en: 'Home' }, href: '/' },
  { label: { it: 'Camere', en: 'Rooms' }, href: '/rooms' },
  { label: { it: 'Galleria', en: 'Gallery' }, href: '/gallery' },
  { label: { it: 'Contatti', en: 'Contact' }, href: '/contact' },
]

const nextLangLabel: Record<Lang, string> = { it: 'EN', en: 'IT' }
const nextLang: Record<Lang, Lang> = { it: 'en', en: 'it' }

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
      <nav className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent
          ? 'bg-transparent'
          : 'bg-[#f5f4ef]/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]'
      )}>
        <div className="max-w-[1624px] mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between py-6">

            {/* Logo */}
            <Link href="/" className={clsx(
              'transition-colors duration-200',
              isTransparent ? 'text-white' : 'text-[#1a1716]'
            )}>
              <span className="font-serif font-semibold text-[22px] tracking-tight">Il B&B</span>
              <span className="font-serif font-light text-[22px] tracking-tight ml-2">di Lorenzo</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    'nav-link text-[15px] font-bold uppercase tracking-[0.08em] transition-all duration-200',
                    isTransparent
                      ? 'text-white/90 hover:text-white'
                      : 'text-[#1a1716]/70 hover:text-[#1a1716]',
                    pathname === link.href && (isTransparent ? 'text-white' : 'text-[#1a1716]')
                  )}
                >
                  {t(link.label)}
                </Link>
              ))}
            </div>

            {/* Right: lang toggle + CTA + hamburger */}
            <div className="flex items-center gap-4">
              {/* Language toggle */}
              <button
                onClick={() => setLang(nextLang[lang])}
                className={clsx(
                  'text-[15px] font-bold uppercase tracking-[0.08em] px-3 py-1.5 border transition-all duration-200',
                  isTransparent
                    ? 'border-white/40 text-white/90 hover:border-white hover:text-white'
                    : 'border-[#1a1716]/20 text-[#1a1716]/70 hover:border-[#1a1716]/60 hover:text-[#1a1716]'
                )}
              >
                {nextLangLabel[lang]}
              </button>

              {/* Book CTA */}
              <a
                href={AIRBNB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'hidden lg:inline-flex items-center justify-center px-8 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] border-2 rounded-sm transition-all duration-300',
                  isTransparent
                    ? 'bg-white text-[#1a1716] border-white hover:bg-transparent hover:text-white hover:shadow-[0_4px_20px_rgba(255,255,255,0.15)]'
                    : 'bg-[#1a1716] text-[#f5f4ef] border-[#1a1716] hover:bg-transparent hover:text-[#1a1716] hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]'
                )}
              >
                {t({ it: 'Prenota', en: 'Book' })}
              </a>

              {/* Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className={clsx('lg:hidden p-1 transition-colors duration-200', isTransparent ? 'text-white' : 'text-[#1a1716]')}
                aria-label="Toggle menu"
              >
                {isMobileOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div className={clsx(
        'fixed inset-0 z-40 flex flex-col bg-[#1a1716] transition-all duration-400',
        isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      )}>
        {/* Top bar */}
        <div className="flex items-center justify-between py-6 px-5 md:px-10 border-b border-white/10">
          <Link href="/" className="text-[#f5f4ef]">
            <span className="font-serif font-semibold text-[22px] tracking-tight">Il B&B</span>
            <span className="font-serif font-light text-[22px] tracking-tight ml-2">di Lorenzo</span>
          </Link>
          <button onClick={() => setIsMobileOpen(false)} className="p-1 text-[#f5f4ef]" aria-label="Close menu">
            <X size={28} strokeWidth={2.5} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 flex flex-col justify-center items-center px-8 gap-5">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
              className={clsx(
                'text-2xl font-bold uppercase tracking-[0.08em] text-[#f5f4ef]/90 hover:text-[#f5f4ef] transition-colors text-center',
                isMobileOpen ? 'animate-fade-up' : 'opacity-0'
              )}
            >
              {t(link.label)}
            </Link>
          ))}

          <div className="pt-8 mt-4 border-t border-white/10 w-full flex flex-col gap-4 items-center">
            <a
              href={AIRBNB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full max-w-xs px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em] bg-white text-[#1a1716] border-2 border-white rounded-sm transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              {t({ it: 'Prenota ora', en: 'Book now' })}
            </a>
            <button
              onClick={() => setLang(nextLang[lang])}
              className="text-[15px] font-bold uppercase tracking-[0.08em] text-[#f5f4ef]/50 hover:text-[#f5f4ef] transition-colors"
            >
              {lang === 'it' ? 'English' : 'Italiano'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
