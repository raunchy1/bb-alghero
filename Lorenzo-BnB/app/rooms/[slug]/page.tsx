'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { property, getRoomBySlug } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'
import BookingForm from '@/components/BookingForm'

export default function RoomDetailPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : ''
  const room = getRoomBySlug(slug)
  const { t, lang } = useLanguage()

  if (!room) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f4ef]">
        <div className="text-center">
          <h1 className="text-4xl font-normal tracking-tight text-[#1a1716] mb-4">
            {lang === 'it' ? 'Camera non trovata' : 'Room not found'}
          </h1>
          <Link
            href="/rooms"
            className="text-[#9e9790] hover:text-[#1a1716] transition-colors text-sm tracking-[0.15em] uppercase"
          >
            &larr; {lang === 'it' ? 'Torna alle camere' : 'Back to rooms'}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[#f5f4ef]">
      {/* ─── HERO (70vh) ─── */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <Image
          src={room.hero}
          alt={t(room.name)}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-[1624px] mx-auto">
            <Link
              href="/rooms"
              className="inline-block text-[#f5f4ef]/60 text-sm tracking-[0.15em] uppercase mb-4 hover:text-[#f5f4ef] transition-colors duration-300"
            >
              &larr; {lang === 'it' ? 'Le camere' : 'Rooms'}
            </Link>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter text-[#f5f4ef] leading-[0.95]">
              {t(room.name)}
            </h1>
          </div>
        </div>
      </section>

      {/* ─── INFO BAR ─── */}
      <section className="py-10 px-6 md:px-12 border-b border-[#1a1716]/10">
        <div className="max-w-[1624px] mx-auto flex flex-wrap gap-8 md:gap-14">
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-1">
              {lang === 'it' ? 'Ospiti' : 'Guests'}
            </p>
            <p className="text-lg text-[#1a1716]">{room.capacity.guests}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-1">
              {lang === 'it' ? 'Letti' : 'Beds'}
            </p>
            <p className="text-lg text-[#1a1716]">{room.capacity.beds}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-1">
              {lang === 'it' ? 'Bagno' : 'Bathroom'}
            </p>
            <p className="text-lg text-[#1a1716]">{room.capacity.bathrooms}</p>
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-1">
              {lang === 'it' ? 'Superficie' : 'Size'}
            </p>
            <p className="text-lg text-[#1a1716]">{room.size} m²</p>
          </div>
        </div>
      </section>

      {/* ─── DESCRIPTION ─── */}
      <section className="py-20 md:py-28 px-6 md:px-12">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-6">
            {lang === 'it' ? 'La camera' : 'The room'}
          </p>
          <p className="text-xl md:text-2xl font-normal text-[#1a1716] leading-relaxed tracking-tight">
            {t(room.description)}
          </p>
        </div>
      </section>

      {/* ─── GALLERY ─── */}
      <section className="pb-20 md:pb-28 px-6 md:px-12">
        <div className="max-w-[1624px] mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-8">
            {lang === 'it' ? 'Galleria' : 'Gallery'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {room.images.map((img, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-lg ${
                  i === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'
                }`}
              >
                <Image
                  src={img}
                  alt={`${t(room.name)} - ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes={i === 0 ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AMENITIES ─── */}
      <section className="pb-20 md:pb-28 px-6 md:px-12">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-8">
            {lang === 'it' ? 'Servizi' : 'Amenities'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {room.amenities.map((amenity, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[#094730] text-sm">&#10003;</span>
                <span className="text-[#1a1716] text-base">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING ─── */}
      <section className="py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <BookingForm variant="card" preselectedRoom={room.slug} />
        </div>
      </section>

      {/* ─── BACK LINK ─── */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-[1624px] mx-auto">
          <Link
            href="/rooms"
            className="inline-flex items-center text-[#9e9790] hover:text-[#1a1716] transition-colors duration-300 text-sm tracking-[0.15em] uppercase"
          >
            &larr;
            <span className="ml-2">
              {lang === 'it' ? 'Tutte le camere' : 'All rooms'}
            </span>
          </Link>
        </div>
      </section>
    </main>
  )
}
