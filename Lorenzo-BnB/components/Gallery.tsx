'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/contexts/LanguageContext'

interface GalleryImage {
  id: number
  url: string
  alt: string
  category: string
}

interface GalleryProps {
  images: GalleryImage[]
  variant?: 'masonry' | 'grid' | 'featured'
}

const categoryLabels: Record<string, { it: string; en: string }> = {
  all:       { it: 'Tutte',     en: 'All' },
  terrazza:  { it: 'Terrazza',  en: 'Terrace' },
  camera:    { it: 'Camera',    en: 'Bedroom' },
  soggiorno: { it: 'Soggiorno', en: 'Living' },
  cucina:    { it: 'Cucina',    en: 'Kitchen' },
  cameretta: { it: 'Cameretta', en: 'Small room' },
  bagno:     { it: 'Bagno',     en: 'Bathroom' },
  vista:     { it: 'Vista',     en: 'View' },
  ingresso:  { it: 'Ingresso',  en: 'Entrance' },
  esterno:   { it: 'Esterno',   en: 'Exterior' },
}

export default function Gallery({ images, variant = 'grid' }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const { t } = useLanguage()

  const categories = ['all', ...Array.from(new Set(images.map((img) => img.category)))]
  const filtered = activeCategory === 'all' ? images : images.filter((img) => img.category === activeCategory)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + filtered.length) % filtered.length : null))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % filtered.length : null))

  const getCategoryLabel = (cat: string) => {
    const labels = categoryLabels[cat]
    if (!labels) return cat
    return t(labels)
  }

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'px-4 py-2 text-xs font-medium tracking-widest uppercase transition-all duration-200',
              activeCategory === cat
                ? 'bg-ocean text-sand'
                : 'bg-white border border-sand-dark text-ocean hover:border-ocean'
            )}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {variant === 'masonry' ? (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {filtered.map((image, index) => (
            <div
              key={image.id}
              className="break-inside-avoid image-zoom cursor-pointer relative group"
              onClick={() => openLightbox(index)}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={image.url} alt={image.alt}
                  width={800} height={600}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : variant === 'featured' ? (
        <>
          {/* Mobile: simple 2-col grid */}
          <div className="sm:hidden grid grid-cols-2 gap-2">
            {filtered.slice(0, 4).map((image, index) => (
              <div key={image.id} className="relative aspect-[4/3] overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}>
                <Image src={image.url} alt={image.alt} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="50vw" loading={index === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>
          {/* Desktop: featured layout */}
          <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-3 h-[560px]">
            {filtered.slice(0, 5).map((image, index) => (
              <div key={image.id}
                className={clsx('relative image-zoom cursor-pointer group overflow-hidden',
                  index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1')}
                onClick={() => openLightbox(index)}>
                <Image src={image.url} alt={image.alt} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes={index === 0 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                  loading={index === 0 ? 'eager' : 'lazy'} />
                <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/20 transition-colors duration-300 flex items-center justify-center">
                  <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                {index === 4 && filtered.length > 5 && (
                  <div className="absolute inset-0 bg-ocean/60 flex items-center justify-center">
                    <div className="text-center text-white">
                      <p className="text-2xl font-serif">+{filtered.length - 5}</p>
                      <p className="text-xs tracking-widest uppercase mt-1">{t({ it: 'altre foto', en: 'more photos' })}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((image, index) => (
            <div key={image.id}
              className="relative aspect-[4/3] image-zoom cursor-pointer group overflow-hidden"
              onClick={() => openLightbox(index)}>
              <Image src={image.url} alt={image.alt} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy" />
              <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/30 transition-colors duration-300 flex items-end p-4">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}>
          <button onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2" aria-label="Close">
            <X size={24} />
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIndex + 1} / {filtered.length}
          </div>
          <button onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10" aria-label="Previous">
            <ChevronLeft size={32} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full mx-2 sm:mx-16"
            onClick={(e) => e.stopPropagation()}>
            <Image src={filtered[lightboxIndex].url} alt={filtered[lightboxIndex].alt}
              width={1200} height={900}
              className="w-full h-full object-contain max-h-[85vh]" priority />
            <p className="text-center text-white/50 text-sm mt-3">{filtered[lightboxIndex].alt}</p>
          </div>
          <button onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-3 hover:bg-white/10" aria-label="Next">
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </>
  )
}
