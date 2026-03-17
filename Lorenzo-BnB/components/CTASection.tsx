'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import listingData from '@/data/listingData.json'

interface CTASectionProps {
  image?: string
  title?: string
  subtitle?: string
  primaryLabel?: string
  primaryHref?: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CTASection({
  image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=85',
  primaryHref = '/book',
  secondaryHref,
  ...props
}: CTASectionProps) {
  const { t } = useLanguage()

  const title       = props.title       ?? t({ it: 'Prenota la tua fuga ad Alghero', en: 'Book your Alghero escape' })
  const subtitle    = props.subtitle    ?? t({ it: 'Disponibilità limitata. Riserva le tue date prima che sia tardi.', en: "Limited availability. Reserve your dates before it's too late." })
  const primaryLabel  = props.primaryLabel  ?? t({ it: 'Prenota ora', en: 'Book now' })
  const secondaryLabel = props.secondaryLabel ?? t({ it: 'Prenota su Airbnb', en: 'Book on Airbnb' })
  const resolvedSecondary = secondaryHref ?? listingData.airbnbUrl

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Background */}
      <div className="absolute inset-0">
        <Image src={image} alt="Alghero coastline" fill className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-navy/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 container-luxury section-pad text-center">
        {/* Turquoise accent line */}
        <div className="w-10 h-0.5 bg-turquoise mx-auto mb-8" />

        <h2 className="text-display-lg font-bold text-cream mb-4 text-balance">
          {title}
        </h2>
        <p className="text-cream/60 text-base max-w-md mx-auto mb-10">
          {subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href={primaryHref} className="btn-light">
            {primaryLabel} <ArrowRight size={14} />
          </Link>
          <a
            href={resolvedSecondary}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-light"
          >
            {secondaryLabel}
          </a>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap items-center justify-center gap-5 mt-14 text-cream/40 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={11} className="fill-coral-light text-coral-light" />)}
            </div>
            {listingData.host.rating} rating
          </span>
          <span className="hidden sm:block w-px h-3 bg-white/20" />
          <span>{listingData.host.reviewCount} {t({ it: 'recensioni', en: 'reviews' })}</span>
          <span className="hidden sm:block w-px h-3 bg-white/20" />
          <span>Superhost</span>
          <span className="hidden sm:block w-px h-3 bg-white/20" />
          <span>{t({ it: 'Minimo 2 notti', en: 'Minimum 2 nights' })}</span>
        </div>
      </div>
    </section>
  )
}
