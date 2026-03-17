'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { property, getAllImages } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'

export default function GalleryPage() {
  const { t, lang } = useLanguage()
  const allImages = useMemo(() => getAllImages(), [])

  const categories = [
    { key: 'all', label: { it: 'Tutti', en: 'All' } },
    ...property.rooms.map((r) => ({ key: r.slug, label: r.name })),
    { key: 'bathroom', label: { it: 'Bagno', en: 'Bathroom' } },
    { key: 'terrace', label: { it: 'Terrazza', en: 'Terrace' } },
    { key: 'balcony', label: { it: 'Balcone', en: 'Balcony' } },
  ]

  const [activeCategory, setActiveCategory] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? allImages
        : allImages.filter((img) => img.category === activeCategory),
    [activeCategory, allImages]
  )

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % filtered.length)
  }, [lightboxIndex, filtered.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)
  }, [lightboxIndex, filtered.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxIndex, goNext, goPrev])

  return (
    <main className="bg-[#f5f4ef] min-h-screen">
      {/* ─── HEADER ─── */}
      <section className="pt-32 pb-12 md:pt-44 md:pb-16 px-6 md:px-12">
        <div className="max-w-[1624px] mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-4">
            {lang === 'it' ? 'Galleria' : 'Gallery'}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter text-[#1a1716] leading-[0.95]">
            {lang === 'it' ? 'Le nostre immagini' : 'Our images'}
          </h1>
        </div>
      </section>

      {/* ─── FILTER TABS ─── */}
      <section className="px-6 md:px-12 pb-12">
        <div className="max-w-[1624px] mx-auto">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-2.5 text-sm rounded-full transition-colors duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-[#1a1716] text-[#f5f4ef]'
                    : 'bg-[#1a1716]/5 text-[#1a1716] hover:bg-[#1a1716]/10'
                }`}
              >
                {t(cat.label)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE GRID (CSS Columns) ─── */}
      <section className="px-6 md:px-12 pb-28">
        <div className="max-w-[1624px] mx-auto">
          <div className="columns-2 md:columns-3 gap-3">
            {filtered.map((img, i) => (
              <button
                key={`${img.url}-${i}`}
                onClick={() => openLightbox(i)}
                className="block w-full mb-3 break-inside-avoid"
              >
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src={img.url}
                    alt={img.alt}
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-[#9e9790] py-20 text-base">
              {lang === 'it' ? 'Nessuna immagine in questa categoria.' : 'No images in this category.'}
            </p>
          )}
        </div>
      </section>

      {/* ─── LIGHTBOX ─── */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-3xl z-50 transition-colors duration-300"
            aria-label="Close"
          >
            &#10005;
          </button>

          {/* Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-4 md:left-8 text-white/40 hover:text-white text-5xl z-50 transition-colors duration-300"
            aria-label="Previous"
          >
            &#8249;
          </button>

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={filtered[lightboxIndex].url}
              alt={filtered[lightboxIndex].alt}
              width={1400}
              height={1000}
              className="max-h-[85vh] w-auto object-contain rounded-lg"
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-4 md:right-8 text-white/40 hover:text-white text-5xl z-50 transition-colors duration-300"
            aria-label="Next"
          >
            &#8250;
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-sm tracking-[0.2em]">
            {lightboxIndex + 1} / {filtered.length}
          </div>
        </div>
      )}
    </main>
  )
}
