'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Bath, Users, MapPin } from 'lucide-react'
import BookingWidget from '@/components/BookingWidget'
import AmenityGrid from '@/components/AmenityGrid'
import CTASection from '@/components/CTASection'
import VillaDescription from '@/components/VillaDescription'
import VillaNeighborhood from '@/components/VillaNeighborhood'
import VillaSubtitle from '@/components/VillaSubtitle'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

export default function VillaPage() {
  const { t } = useLanguage()

  const stats = [
    { icon: BedDouble, value: listingData.rooms.bedrooms, label: t({ it: 'Camere', en: 'Bedrooms' }) },
    { icon: Bath, value: listingData.rooms.bathrooms, label: t({ it: 'Bagno', en: 'Bathroom' }) },
    { icon: Users, value: listingData.rooms.maxGuests, label: t({ it: 'Ospiti max', en: 'Max guests' }) },
    { icon: MapPin, value: '2,1 km', label: t({ it: 'Dalla spiaggia', en: 'To the beach' }) },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={listingData.images.gallery[1].url}
            alt="Lorenzo's B&B"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 container-luxury pb-16">
          <div className="flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase mb-3">
            <MapPin size={12} />
            <span>{listingData.location.city}, {listingData.location.region}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-display-lg lg:text-display-xl text-white">{listingData.title}</h1>
          <VillaSubtitle />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="bg-white border-b border-sand-dark">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-sand-dark">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-3 py-4 px-4 sm:py-6 sm:px-8">
                <Icon size={20} className="text-sunset flex-shrink-0" />
                <div>
                  <p className="font-serif text-2xl text-ocean leading-none">{value}</p>
                  <p className="text-xs text-stone mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 lg:py-32">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Description */}
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'La Casa', en: 'The Villa' })}</p>
                <h2 className="font-serif text-display-sm text-ocean mb-6">Lorenzo's B&amp;B</h2>
                <div className="divider" />
                <VillaDescription />
              </div>

              {/* Bedrooms */}
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Sistemazione notte', en: 'Sleeping arrangements' })}</p>
                <h2 className="font-serif text-display-sm text-ocean mb-6">{t({ it: 'Camere', en: 'Bedrooms' })}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {listingData.rooms.bedroomDetails.map((room) => (
                    <div key={room.name} className="border border-sand-dark p-5">
                      <div className="w-8 h-8 bg-sand flex items-center justify-center mb-3">
                        <BedDouble size={16} className="text-sunset" />
                      </div>
                      <h4 className="font-medium text-ocean text-sm mb-1">{room.name}</h4>
                      <p className="text-xs text-stone mb-2">{room.bedType} · {t({ it: 'Piano', en: 'Floor' })} {room.floor}</p>
                      <p className="text-xs text-stone leading-relaxed">{room.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos Grid */}
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Gli spazi', en: 'The spaces' })}</p>
                <h2 className="font-serif text-display-sm text-ocean mb-6">{t({ it: 'Interno ed esterno', en: 'Interior and exterior' })}</h2>
                <div className="grid grid-cols-2 gap-3">
                  {listingData.images.gallery.slice(0, 6).map((image) => (
                    <div key={image.id} className="relative aspect-[4/3] overflow-hidden group">
                      <Image
                        src={image.url} alt={image.alt} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, 33vw" loading="lazy"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/gallery" className="btn-outline text-sm">
                    {t({ it: 'Galleria completa →', en: 'Full gallery →' })}
                  </Link>
                </div>
              </div>

              {/* Neighborhood */}
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Posizione', en: 'Location' })}</p>
                <h2 className="font-serif text-display-sm text-ocean mb-6">{t({ it: 'Il quartiere', en: 'The neighborhood' })}</h2>
                <div className="divider" />
                <VillaNeighborhood />
                <div className="relative aspect-video bg-sand-dark overflow-hidden">
                  <iframe
                    src={`https://maps.google.com/maps?q=${listingData.location.coordinates.lat},${listingData.location.coordinates.lng}&z=13&output=embed`}
                    className="w-full h-full border-0" loading="lazy" title="Villa location"
                  />
                </div>
                <p className="text-xs text-stone mt-3">
                  {t({ it: "L'indirizzo esatto viene fornito dopo la conferma della prenotazione.", en: 'The exact address is provided after booking confirmation.' })}
                </p>
              </div>

              {/* Amenities */}
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Cosa è incluso', en: "What's included" })}</p>
                <h2 className="font-serif text-display-sm text-ocean mb-6">{t({ it: 'Servizi', en: 'Amenities' })}</h2>
                <AmenityGrid amenities={listingData.amenities} variant="compact" showAll={true} />
                <div className="mt-6">
                  <Link href="/amenities" className="btn-outline text-sm">
                    {t({ it: 'Tutti i servizi →', en: 'All amenities →' })}
                  </Link>
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div>
              <BookingWidget variant="sidebar" />
              <div className="mt-6 p-4 bg-sand border border-sand-dark text-center">
                <p className="text-xs text-stone mb-3">{t({ it: 'Disponibile anche su', en: 'Also available on' })}</p>
                <a href={listingData.airbnbUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-medium tracking-widest uppercase text-ocean hover:text-sunset transition-colors">
                  {t({ it: 'Prenota su Airbnb →', en: 'Book on Airbnb →' })}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
