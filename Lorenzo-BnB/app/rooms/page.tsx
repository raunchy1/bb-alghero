'use client'

import Image from 'next/image'
import Link from 'next/link'
import { property } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RoomsPage() {
  const { t, lang } = useLanguage()

  return (
    <main className="bg-[#f5f4ef]">
      {/* ─── HEADER ─── */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 px-6 md:px-12">
        <div className="max-w-[1624px] mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-4">
            {lang === 'it' ? 'Le camere' : 'Our rooms'}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter text-[#1a1716] leading-[0.95]">
            {lang === 'it' ? 'Le nostre camere' : 'Our rooms'}
          </h1>
        </div>
      </section>

      {/* ─── ROOMS (vertical, alternating) ─── */}
      {property.rooms.map((room, index) => {
        const isEven = index % 2 === 0

        return (
          <section key={room.slug} className="py-12 md:py-20 px-6 md:px-12">
            <div className="max-w-[1624px] mx-auto">
              <div
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-10 md:gap-16 items-center`}
              >
                {/* Image */}
                <Link
                  href={`/rooms/${room.slug}`}
                  className="group w-full lg:w-1/2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image
                      src={room.hero}
                      alt={t(room.name)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </Link>

                {/* Text */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-4">
                    {lang === 'it' ? `Camera ${index + 1}` : `Room ${index + 1}`}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-[#1a1716] mb-4 leading-tight">
                    {t(room.name)}
                  </h2>
                  <p className="text-[#9e9790] text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                    {t(room.tagline)}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-10">
                    <span className="inline-flex items-center px-4 py-2 bg-[#1a1716]/5 rounded-full text-sm text-[#1a1716]">
                      {room.capacity.guests} {lang === 'it' ? 'ospiti' : 'guests'}
                    </span>
                    <span className="inline-flex items-center px-4 py-2 bg-[#1a1716]/5 rounded-full text-sm text-[#1a1716]">
                      {room.capacity.beds}
                    </span>
                    <span className="inline-flex items-center px-4 py-2 bg-[#1a1716]/5 rounded-full text-sm text-[#1a1716]">
                      {room.size} m²
                    </span>
                    <span className="inline-flex items-center px-4 py-2 bg-[#1a1716]/5 rounded-full text-sm text-[#1a1716]">
                      {room.capacity.bathrooms} {lang === 'it' ? 'bagno' : 'bathroom'}
                    </span>
                  </div>

                  <Link
                    href={`/rooms/${room.slug}`}
                    className="inline-flex items-center text-[#1a1716] text-sm tracking-[0.15em] uppercase group/link"
                  >
                    <span className="border-b border-[#1a1716]/30 group-hover/link:border-[#1a1716] transition-colors duration-300">
                      {lang === 'it' ? 'Scopri' : 'Discover'}
                    </span>
                    <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      {/* ─── CTA ─── */}
      <section className="py-28 md:py-44 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-normal tracking-tighter text-[#1a1716] mb-6 leading-tight">
            {lang === 'it' ? 'Prenota il tuo soggiorno' : 'Book your stay'}
          </h2>
          <p className="text-[#9e9790] text-lg mb-10">
            {t(property.tagline)}
          </p>
          <a
            href={property.contact.airbnbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-[#1a1716] text-[#f5f4ef] text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#272220] transition-colors duration-300"
          >
            {lang === 'it' ? 'Prenota su Airbnb' : 'Book on Airbnb'}
          </a>
        </div>
      </section>
    </main>
  )
}
