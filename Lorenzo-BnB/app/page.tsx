'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { property } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'
import BookingForm from '@/components/BookingForm'

const wordRevealContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const wordRevealChild = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

const cardContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HomePage() {
  const { t, lang } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.1, 1])

  const titleWords = property.name.split(' ')

  return (
    <main>
      {/* ─── HERO (100vh) ─── */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <Image
            src="/images/alghero-sardinia-italy654270282-1.jpg.webp"
            alt={property.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-16 left-0 w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-[1624px] mx-auto">
            <motion.div
              variants={wordRevealContainer}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-6xl md:text-8xl font-normal font-serif tracking-tighter text-[#f5f4ef] mb-4 leading-[0.95]">
                {titleWords.map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordRevealChild}
                    className="inline-block mr-[0.3em]"
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-[#f5f4ef]/70 text-base md:text-lg font-light tracking-wide mb-8 max-w-xl"
            >
              {t(property.tagline)}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/rooms"
                className="btn-premium inline-block px-8 py-4 bg-[#f5f4ef] text-[#1a1716] text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-white transition-colors duration-300"
              >
                <span>{lang === 'it' ? 'Scopri le camere' : 'Discover rooms'}</span>
              </Link>
              <a
                href={property.contact.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 border border-[#f5f4ef]/40 text-[#f5f4ef] text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#f5f4ef]/10 transition-colors duration-300"
              >
                {lang === 'it' ? 'Prenota su Airbnb' : 'Book on Airbnb'}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── INTRO TEXT ─── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7 }}
        className="py-24 md:py-40 px-6 md:px-12"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-4xl font-normal tracking-tight leading-snug">
            <span className="text-[#9e9790]">
              {lang === 'it'
                ? 'Camere esclusive di lusso nel cuore di Alghero, '
                : 'Exclusive luxury rooms in the heart of Alghero, '}
            </span>
            <span className="text-[#1a1716]">
              {lang === 'it'
                ? 'a soli 150 metri dalla spiaggia.'
                : 'just 150 meters from the beach.'}
            </span>
            <span className="text-[#9e9790]">
              {' '}
              {lang === 'it'
                ? 'Design moderno, materiali pregiati e attenzione ai dettagli.'
                : 'Modern design, premium materials and attention to detail.'}
            </span>
          </p>
          <p className="mt-10 text-[#9e9790] text-sm tracking-[0.2em] uppercase">
            {property.location.city}, {property.location.region}
          </p>
        </div>
      </motion.section>

      {/* ─── ROOMS PREVIEW ─── */}
      <section className="pb-24 md:pb-40 px-6 md:px-12">
        <div className="max-w-[1624px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6 }}
            className="tracking-[0.2em] uppercase text-xs text-[#9e9790] mb-4"
          >
            {lang === 'it' ? 'Le camere' : 'Our rooms'}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif italic font-normal tracking-tight text-[#1a1716] mb-2"
          >
            {lang === 'it' ? 'Le nostre camere' : 'Our rooms'}
          </motion.h2>

          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-[1px] bg-[#1a1716]/30 mb-10"
          />

          <motion.div
            variants={cardContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {property.rooms.map((room) => (
              <Link key={room.slug} href={`/rooms/${room.slug}`} className="group">
                <motion.div variants={cardItem}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image
                      src={room.hero}
                      alt={t(room.name)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="mt-5 text-xl font-normal text-[#1a1716] tracking-tight">
                    {t(room.name)}
                  </h3>
                  <p className="mt-1 text-sm text-[#9e9790]">
                    {room.capacity.guests} {lang === 'it' ? 'ospiti' : 'guests'} · {room.size} m²
                  </p>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full"
      >
        <div className="relative aspect-[21/9] w-full overflow-hidden">
          <Image
            src="/images/terrace/terrace-06.jpeg"
            alt="Panoramic terrace"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <div className="text-center max-w-3xl">
              <p className="tracking-[0.2em] uppercase text-xs text-[#f5f4ef]/60 mb-6">
                {lang === 'it' ? "L'esperienza" : 'The experience'}
              </p>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic font-normal tracking-tighter text-[#f5f4ef] leading-tight">
                {lang === 'it'
                  ? 'Una terrazza panoramica sul mare di Alghero'
                  : 'A panoramic terrace overlooking the sea of Alghero'}
              </h2>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 60 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-[1px] bg-[#f5f4ef]/40 mx-auto mt-6"
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── BOOKING ─── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0 }}
        transition={{ duration: 0.7 }}
        className="py-28 md:py-44 px-6 md:px-12"
      >
        <div className="max-w-3xl mx-auto">
          <BookingForm variant="card" />
        </div>
      </motion.section>
    </main>
  )
}
