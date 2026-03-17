'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Anchor, Wine, ShoppingBag, TreePine } from 'lucide-react'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

const iconMap: Record<string, React.ElementType> = {
  Anchor, Wine, ShoppingBag, TreePine, MapPin,
}

export default function ExploreSardinia() {
  const { t } = useLanguage()
  const { beaches, experiences, restaurants } = listingData.explore

  return (
    <div className="space-y-20">
      {/* Beaches */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-stone mb-2">Alghero {t({ it: 'e dintorni', en: 'and surroundings' })}</p>
            <h3 className="font-serif text-display-sm text-ocean">{t({ it: 'Le spiagge più belle', en: 'The most beautiful beaches' })}</h3>
          </div>
          <Link href="/explore#beaches" className="hidden sm:block btn-ghost text-xs">
            {t({ it: 'Vedi tutte →', en: 'View all →' })}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {beaches.map((beach) => (
            <div key={beach.name} className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden mb-4">
                <Image
                  src={beach.image}
                  alt={beach.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-serif text-lg text-ocean">{beach.name}</h4>
                <span className="text-xs text-stone bg-sand-dark px-2 py-1 flex-shrink-0 ml-2">{beach.distance}</span>
              </div>
              <p className="text-sm text-stone leading-relaxed">{t(beach.description)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Experiences */}
      <div>
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-2">{t({ it: 'Scopri', en: 'Discover' })}</p>
          <h3 className="font-serif text-display-sm text-ocean">{t({ it: 'Esperienze locali', en: 'Local experiences' })}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {experiences.map((exp, i) => {
            const Icon = iconMap[exp.icon] || MapPin
            return (
              <div key={i}
                className="bg-white border border-sand-dark p-6 group hover:border-ocean hover:shadow-luxury transition-all duration-300">
                <div className="w-12 h-12 bg-sand flex items-center justify-center mb-4 group-hover:bg-ocean transition-colors duration-300">
                  <Icon size={20} className="text-ocean group-hover:text-sand transition-colors duration-300" />
                </div>
                <h4 className="font-medium text-ocean text-sm mb-2">{t(exp.name)}</h4>
                <p className="text-xs text-stone leading-relaxed">{t(exp.description)}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Restaurants */}
      <div>
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-2">{t({ it: 'Mangia & Bevi', en: 'Food & Drink' })}</p>
          <h3 className="font-serif text-display-sm text-ocean">{t({ it: 'Ristoranti consigliati', en: 'Recommended restaurants' })}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((restaurant, i) => (
            <div key={restaurant.name}
              className="flex gap-4 p-5 bg-white border border-sand-dark hover:shadow-luxury transition-all duration-300">
              <div className="w-8 h-8 bg-sand flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-serif text-sm text-stone">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="font-medium text-ocean text-sm">{restaurant.name}</h4>
                  <span className="text-xs text-stone flex-shrink-0">{restaurant.distance}</span>
                </div>
                <p className="text-xs text-stone leading-relaxed">{t(restaurant.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
