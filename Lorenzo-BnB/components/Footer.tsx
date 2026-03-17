'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

const AIRBNB_URL = 'https://www.airbnb.it/rooms/1610343576481869093'

const navLinks = [
  { label: { it: 'Home', en: 'Home' }, href: '/' },
  { label: { it: 'Camere', en: 'Rooms' }, href: '/rooms' },
  { label: { it: 'Galleria', en: 'Gallery' }, href: '/gallery' },
  { label: { it: 'Contatti', en: 'Contact' }, href: '/contact' },
]

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-charcoal text-cream">
      <div className="container-hut py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">

          {/* Brand */}
          <div>
            <Link href="/" className="block mb-4 tracking-tight">
              <span className="font-medium text-xl text-cream">Il B&amp;B di Lorenzo</span>
              <span className="block text-sm text-cream/40 font-light tracking-widest uppercase mt-1">
                Exclusive Rooms
              </span>
            </Link>
            <p className="text-cream/50 text-sm leading-relaxed max-w-xs">
              {t({
                it: 'Camere esclusive nel cuore di Alghero, Sardegna.',
                en: 'Exclusive rooms in the heart of Alghero, Sardinia.'
              })}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-cream/30 mb-6">
              {t({ it: 'Navigazione', en: 'Navigation' })}
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/55 hover:text-cream transition-colors">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={AIRBNB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-cream/55 hover:text-cream transition-colors"
                >
                  Airbnb &#8599;
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-medium tracking-widest uppercase text-cream/30 mb-6">
              {t({ it: 'Contatti', en: 'Contact' })}
            </h4>
            <div className="space-y-3 text-sm text-cream/50">
              <div className="flex items-center gap-2.5">
                <MapPin size={14} className="text-cream/30 flex-shrink-0" />
                <span>Alghero, Sardegna</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={14} className="text-cream/30 flex-shrink-0" />
                <a href="tel:+393478327243" className="hover:text-cream transition-colors">
                  +39 347 832 7243
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-cream/30 flex-shrink-0" />
                <a href="mailto:info@lasuiten4.it" className="hover:text-cream transition-colors">
                  info@lasuiten4.it
                </a>
              </div>
              <a
                href="https://wa.me/393478327243"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-cream/50 hover:text-cream transition-colors pt-1"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* CIN */}
        <div className="mt-16 pt-6 border-t border-white/8">
          <p className="text-xs text-cream/25 mb-1">
            <span className="uppercase tracking-wide">CIN</span> IT090003B4000F4256
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="container-hut py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-grey">
            &copy; 2024 Il B&amp;B di Lorenzo &mdash; Exclusive Rooms. {t({ it: 'Tutti i diritti riservati.', en: 'All rights reserved.' })}
          </p>
          <div className="flex items-center gap-5 text-xs text-grey">
            <Link href="/contact" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link href="/contact" className="hover:text-cream transition-colors">{t({ it: 'Termini', en: 'Terms' })}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
