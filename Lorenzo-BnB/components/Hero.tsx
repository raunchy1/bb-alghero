'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, MapPin, Star } from 'lucide-react'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()

  const scrollDown = () => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={listingData.images.hero}
          alt="Capo Caccia – Alghero, Sardinia"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay – dark at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content pinned to bottom */}
      <div className="relative z-10 container-luxury pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-3xl">

          {/* Location badge */}
          <div className="inline-flex items-center gap-1.5 text-white/70 text-xs font-medium tracking-widest uppercase mb-5 animate-fade-in">
            <MapPin size={11} />
            <span>{listingData.location.city} · {listingData.location.region} · {listingData.location.country}</span>
          </div>

          {/* Headline */}
          <h1 className="text-display-2xl font-bold text-white mb-5 text-balance animate-fade-up" style={{ letterSpacing: '-0.04em' }}>
            {t(listingData.tagline)}
          </h1>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/70 text-sm mb-8 animate-fade-up animate-delay-100">
            <span className="flex items-center gap-1.5">
              <Star size={13} className="text-coral-light fill-coral-light" />
              <span className="text-white font-semibold">{listingData.host.rating}</span>
              <span>· {listingData.host.reviewCount} {t({ it: 'recensioni', en: 'reviews' })}</span>
            </span>
            <span className="hidden sm:block w-px h-3.5 bg-white/25" />
            <span>{listingData.rooms.maxGuests} {t({ it: 'ospiti', en: 'guests' })}</span>
            <span className="hidden sm:block w-px h-3.5 bg-white/25" />
            <span>700 m {t({ it: 'dal mare', en: 'to the sea' })}</span>
            <span className="hidden sm:block w-px h-3.5 bg-white/25" />
            <span>{t({ it: 'Colazione su richiesta', en: 'Breakfast on request' })}</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 animate-fade-up animate-delay-200">
            <Link href="/book" className="btn-light">
              {t({ it: 'Prenota ora', en: 'Book now' })}
            </Link>
            <Link href="/villa" className="btn-outline-light">
              {t({ it: 'Scopri la camera', en: 'Discover the room' })}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className="absolute bottom-7 right-8 z-10 flex flex-col items-center gap-1.5 text-white/50 hover:text-white transition-colors duration-200 hidden sm:flex"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase" style={{ writingMode: 'vertical-rl' }}>
          {t({ it: 'Scopri', en: 'Explore' })}
        </span>
        <ChevronDown size={16} className="animate-bounce" />
      </button>
    </section>
  )
}
