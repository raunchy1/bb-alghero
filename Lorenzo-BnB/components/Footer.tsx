'use client'

import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer() {
  const { t, lang } = useLanguage()

  return (
    <footer className="w-full bg-navy text-white overflow-hidden">
      {/* Brand Identity Block */}
      <div className="flex flex-col items-center pt-24 pb-16 px-12">
        <span className="font-serif italic font-light text-6xl md:text-7xl text-white/90 tracking-tight mb-4">
          La Suite N4
        </span>
        <div className="flex flex-col items-center gap-6">
          <span className="font-sans uppercase tracking-[0.4em] text-[13px] text-gold">
            Alghero · Sardegna
          </span>
          <div className="w-20 h-px bg-gold/50" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 px-12 pb-24 border-t border-white/5 pt-16">
        {/* Column 1: Contatti */}
        <div className="flex flex-col space-y-8">
          <h4 className="font-sans uppercase tracking-[0.3em] text-[11px] text-gold/80">
            {t({ it: 'Contatti', en: 'Contact' })}
          </h4>
          <div className="flex flex-col space-y-4 font-light text-sm tracking-wide leading-relaxed text-white/70">
            <p>Alghero (SS), Sardegna<br />Italia</p>
            <a href="tel:+393478327243" className="hover:text-white transition-colors">+39 347 832 7243</a>
            <a href="mailto:info@lasuiten4.it" className="hover:text-white transition-colors">info@lasuiten4.it</a>
            <a href="https://wa.me/393478327243" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 group cursor-pointer">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="group-hover:text-white transition-colors">WhatsApp Concierge</span>
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col space-y-8 md:items-center">
          <div className="flex flex-col space-y-8">
            <h4 className="font-sans uppercase tracking-[0.3em] text-[11px] text-gold/80">Quick links</h4>
            <ul className="flex flex-col space-y-4 font-light text-sm tracking-widest uppercase">
              <li><Link href="/rooms" className="text-white/60 hover:text-gold transition-all duration-500">{t({ it: 'Le Suite', en: 'Suites' })}</Link></li>
              <li><Link href="/gallery" className="text-white/60 hover:text-gold transition-all duration-500">{t({ it: 'Galleria', en: 'Gallery' })}</Link></li>
              <li><Link href="/explore" className="text-white/60 hover:text-gold transition-all duration-500">{t({ it: 'Esperienze', en: 'Experiences' })}</Link></li>
              <li><Link href="/book" className="text-white/60 hover:text-gold transition-all duration-500">{t({ it: 'Prenota', en: 'Book' })}</Link></li>
            </ul>
          </div>
        </div>

        {/* Column 3: Partner */}
        <div className="flex flex-col space-y-8 md:items-end md:text-right">
          <h4 className="font-sans uppercase tracking-[0.3em] text-[11px] text-gold/80">Partner</h4>
          <div className="flex flex-col space-y-4">
            <span className="font-serif italic text-2xl text-white/90">Sea Star</span>
            <span className="font-sans uppercase tracking-[0.2em] text-[10px] text-white/40">Beach Restaurant</span>
            <p className="font-light text-xs text-white/50 max-w-[200px] md:ml-auto leading-loose">
              {lang === 'it'
                ? "Un'esperienza culinaria sul mare curata dai migliori chef."
                : "A seaside culinary experience curated by the finest chefs."}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-full border-t border-white/5 bg-[#0a1620] px-12 py-8">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/30 text-center md:text-left">
            &copy; 2025 La Suite N4 Alghero · {t({ it: 'Tutti i diritti riservati', en: 'All rights reserved' })}
          </p>
          <div className="flex gap-8 font-sans text-[10px] uppercase tracking-[0.2em] text-white/30">
            <Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
