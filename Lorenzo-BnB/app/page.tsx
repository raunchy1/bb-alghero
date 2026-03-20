'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Gift, Instagram } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { property } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

// ─── HERO ───
function HeroSection() {
  const { lang } = useLanguage()
  const heroRef = useRef<HTMLElement>(null)
  const [scrollVisible, setScrollVisible] = useState(true)

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    const h = () => setScrollVisible(window.scrollY < 300)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <section ref={heroRef} className="relative h-screen-safe w-full overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: heroY }}>
        <Image src="/images/alghero-sardinia-italy654270282-1.jpg.webp" alt="Alghero coast" fill priority className="object-cover scale-105" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(4,22,39,0.4) 0%, rgba(4,22,39,0) 40%)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,22,39,0.9) 0%, rgba(4,22,39,0) 70%)' }} />

      <div className="relative z-10 h-full flex flex-col justify-end pb-24 px-6 md:px-12 lg:px-20 max-w-7xl">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
          className="font-sans text-[11px] text-white/60 tracking-[0.4em] uppercase mb-6 block">
          ALGHERO · SARDEGNA · SUITE ESCLUSIVE
        </motion.span>

        <h1 className="font-serif italic font-light text-white leading-[0.85] mb-6">
          <div className="overflow-hidden">
            <motion.span initial={{ clipPath: 'polygon(0 100%,100% 100%,100% 100%,0 100%)' }} animate={{ clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }}
              transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block text-[52px] sm:text-7xl md:text-[120px]">La Suite</motion.span>
          </div>
          <div className="overflow-hidden">
            <motion.span initial={{ clipPath: 'polygon(0 100%,100% 100%,100% 100%,0 100%)' }} animate={{ clipPath: 'polygon(0 0,100% 0,100% 100%,0 100%)' }}
              transition={{ delay: 0.7, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="block text-[52px] sm:text-7xl md:text-[120px] ml-2 sm:ml-4 md:ml-20">N4</motion.span>
          </div>
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}
          className="font-serif text-xl sm:text-2xl md:text-[36px] text-white/80 leading-snug max-w-2xl mb-8 md:mb-12">
          {lang === 'it' ? 'Terrazze panoramiche private · Vista sul mare di Alghero' : 'Private panoramic terraces · View of the Alghero sea'}
        </motion.p>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.6, duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Link href="/book" className="bg-gold text-white px-10 py-5 text-sm font-sans uppercase tracking-[0.2em] hover:bg-[#b8854e] transition-all">
            {lang === 'it' ? 'Prenota Ora →' : 'Book Now →'}
          </Link>
          <Link href="/rooms" className="border border-white/30 text-white px-10 py-5 text-sm font-sans uppercase tracking-[0.2em] backdrop-blur-sm hover:bg-white hover:text-navy transition-all">
            {lang === 'it' ? 'Scopri le Suite' : 'Discover Suites'}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator — right side, vertical */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: scrollVisible ? 1 : 0 }} transition={{ duration: 0.4 }}
        className="absolute bottom-10 right-6 md:right-20 flex-col items-center gap-4 hidden sm:flex">
        <span className="font-sans text-[10px] text-white/40 uppercase tracking-[0.4em]" style={{ writingMode: 'vertical-lr' }}>Scroll</span>
        <div className="w-px h-[60px] bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gold/80 animate-scroll-dot" />
        </div>
      </motion.div>
    </section>
  )
}

// ─── EDITORIAL SECTION (below hero, from Stitch) ───
function EditorialSection() {
  const { lang } = useLanguage()
  return (
    <section className="bg-ivory py-24 px-6 md:px-12 lg:px-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center max-w-7xl mx-auto">
        <div className="relative group">
          <div className="aspect-[4/5] overflow-hidden">
            <Image src="/images/rooms/suite-luxury-tripla/room-01.jpeg" alt="Luxury suite interior" fill
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 !relative w-full h-full" sizes="50vw" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-2/3 aspect-square bg-[#f5f3ef] p-12 hidden md:block">
            <h3 className="font-serif italic text-3xl mb-4 text-navy">
              {lang === 'it' ? "Un'oasi di Silenzio" : 'An Oasis of Silence'}
            </h3>
            <p className="font-sans text-[#44474c] text-sm leading-relaxed">
              {lang === 'it'
                ? "Design essenziale che incontra la storicità delle mura di Alghero. Ogni suite è un racconto di luce e materia."
                : "Essential design meets the historic walls of Alghero. Each suite tells a story of light and material."}
            </p>
          </div>
        </div>
        <div className="space-y-12">
          <div>
            <span className="font-sans text-xs text-gold tracking-[0.4em] uppercase mb-4 block font-medium">
              {lang === 'it' ? "L'Esperienza" : 'The Experience'}
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-navy leading-tight italic">
              {lang === 'it' ? 'Il Lusso della Semplicità' : 'The Luxury of Simplicity'}
            </h2>
          </div>
          <p className="font-sans text-lg text-[#44474c] max-w-md leading-relaxed">
            {lang === 'it'
              ? "Svegliarsi con il suono delle onde che si infrangono sui bastioni. La Suite N4 non è solo un soggiorno, è un'immersione nell'anima più autentica della Sardegna."
              : "Waking up to the sound of waves crashing against the bastions. La Suite N4 is not just a stay, it's an immersion into the most authentic soul of Sardinia."}
          </p>
          <Link href="/gallery" className="inline-block font-sans text-xs uppercase tracking-[0.3em] text-navy border-b border-gold pb-2 hover:border-navy transition-all">
            {lang === 'it' ? 'Esplora la Galleria' : 'Explore the Gallery'}
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── ABOUT ───
function AboutSection() {
  const { lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [counts, setCounts] = useState({ suites: 0, terr: 0 })

  useEffect(() => {
    if (!sectionRef.current) return
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current, start: 'top 70%', once: true,
      onEnter: () => {
        const dur = 2000, start = Date.now()
        const anim = () => {
          const p = Math.min((Date.now() - start) / dur, 1)
          const e = 1 - Math.pow(1 - p, 3)
          setCounts({ suites: Math.round(e * 4), terr: Math.round(e * 4) })
          if (p < 1) requestAnimationFrame(anim)
        }
        requestAnimationFrame(anim)
      },
    })
    return () => trigger.kill()
  }, [])

  return (
    <section ref={sectionRef} className="bg-[#FAF8F4] py-[120px] px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          {/* Left 55% */}
          <div className="lg:col-span-7">
            <div className="mb-8 flex items-center space-x-4">
              <span className="text-gold font-sans text-[11px] uppercase tracking-[0.3em] font-medium">LA STRUTTURA</span>
              <div className="h-px w-[50px] bg-gold/40" />
            </div>
            <motion.h2 initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic text-[42px] md:text-[58px] text-navy leading-[1.1] mb-10 max-w-2xl">
              {lang === 'it' ? 'Un rifugio esclusivo nel cuore di Alghero' : 'An exclusive retreat in the heart of Alghero'}
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-sans font-light text-[16px] text-[#44474c] leading-[1.9] mb-16 max-w-xl">
              {lang === 'it'
                ? "La Suite N4 Alghero offre quattro suite esclusive, ognuna con terrazza panoramica privata e una vista mozzafiato sulla riviera del corallo. Ogni dettaglio è stato curato per offrire un'esperienza di soggiorno che fonde l'eleganza contemporanea con il calore dell'ospitalità mediterranea più autentica."
                : "La Suite N4 Alghero offers four exclusive suites, each with a private panoramic terrace and breathtaking views of the coral riviera. Every detail has been curated to offer a stay that blends contemporary elegance with the warmth of the most authentic Mediterranean hospitality."}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div><span className="font-serif text-navy text-[48px] leading-tight block">{counts.suites}</span><span className="text-[#74777d] font-sans text-[11px] uppercase tracking-[0.3em] mt-2 block">Suite</span></div>
              <div><span className="font-serif text-navy text-[48px] leading-tight block">{counts.terr}</span><span className="text-[#74777d] font-sans text-[11px] uppercase tracking-[0.3em] mt-2 block">{lang === 'it' ? 'Terrazze' : 'Terraces'}</span></div>
              <div><span className="font-serif text-navy text-[48px] leading-tight block">★</span><span className="text-[#74777d] font-sans text-[11px] uppercase tracking-[0.3em] mt-2 block">{lang === 'it' ? 'Esclusivo' : 'Exclusive'}</span></div>
              <div><span className="text-navy text-[32px] block">🌊</span><span className="text-[#74777d] font-sans text-[11px] uppercase tracking-[0.3em] mt-[1.4rem] block">{lang === 'it' ? 'Vista Mare' : 'Sea View'}</span></div>
            </motion.div>
          </div>
          {/* Right 45% */}
          <div className="lg:col-span-5 relative mt-12 lg:mt-0">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.8 }} className="relative w-full aspect-[4/5] overflow-hidden shadow-[0_40px_100px_rgba(27,28,26,0.06)] z-10">
              <Image src="/images/collage.jpeg" alt="La Suite N4 interior" fill className="object-cover hover:scale-105 transition-transform duration-1000" sizes="45vw" />
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="absolute -bottom-16 -left-12 md:-left-20 w-3/4 aspect-[4/3] overflow-hidden shadow-[0_30px_80px_rgba(27,28,26,0.08)] z-20 hidden md:block border-[12px] border-[#FAF8F4]">
              <Image src="/images/balcony/balcony-01.jpeg" alt="Sea view terrace" fill className="object-cover" sizes="400px" />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/5 -z-0" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MARQUEE ───
function MarqueeStrip() {
  const text = 'TERRAZZA PANORAMICA · ALGHERO · SUITE ESCLUSIVE · VISTA MARE · COLAZIONE SU RICHIESTA · SEA STAR PARTNER · PRENOTAZIONE DIRETTA · '
  return (
    <div className="bg-navy h-[70px] flex items-center overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => <span key={i} className="font-serif italic text-[28px] text-gold/80">{text}</span>)}
      </div>
    </div>
  )
}

// ─── SUITE CARD ───
function SuiteCard({ room, index, t, lang }: { room: (typeof property.rooms)[0]; index: number; t: (v: { it: string; en: string }) => string; lang: string }) {
  return (
    <Link href={`/rooms/${room.slug}`} className="group bg-white flex flex-col relative shrink-0 shadow-2xl" style={{ width: '100%', minWidth: 280, maxWidth: 380, height: 520 }}>
      <div className="h-[65%] w-full overflow-hidden">
        <Image src={room.hero} alt={t(room.name)} fill className="object-cover !relative w-full h-full grayscale-[20%] group-hover:scale-105 transition-transform duration-700" sizes="380px" />
      </div>
      <div className="h-[35%] w-full p-6 md:p-8 flex flex-col justify-between relative bg-white">
        <span className="absolute top-0 right-4 font-serif text-[80px] md:text-[100px] leading-none text-navy opacity-[0.05] -translate-y-1/2 select-none pointer-events-none">0{index + 1}</span>
        <div>
          <h3 className="font-serif italic text-xl md:text-2xl text-navy mb-3">{t(room.name)}</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 border border-gold text-gold text-[10px] tracking-widest uppercase font-sans">{lang === 'it' ? 'Terrazza' : 'Terrace'}</span>
            <span className="px-3 py-1 border border-gold text-gold text-[10px] tracking-widest uppercase font-sans">{room.capacity.guests} {lang === 'it' ? 'ospiti' : 'guests'}</span>
          </div>
        </div>
        <span className="inline-flex items-center text-navy text-sm tracking-widest uppercase font-sans">
          {lang === 'it' ? 'Scopri' : 'Discover'} <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
        </span>
      </div>
    </Link>
  )
}

// ─── SUITES HORIZONTAL SCROLL ───
function SuitesSection() {
  const { t, lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile || !sectionRef.current || !trackRef.current) return
    const track = trackRef.current
    const getScrollAmount = () => track.scrollWidth - window.innerWidth * 0.667
    const tween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
    return () => { tween.scrollTrigger?.kill(); tween.kill() }
  }, [isMobile])

  return (
    <section ref={sectionRef} className="bg-navy overflow-hidden">
      {/* Desktop: GSAP horizontal scroll */}
      <div className="hidden md:flex h-screen">
        <div className="w-1/3 p-24 flex flex-col justify-center shrink-0 z-10 bg-navy">
          <span className="text-gold font-sans tracking-[0.4em] uppercase text-xs mb-6 block font-medium">
            {lang === 'it' ? 'LE SUITE' : 'THE SUITES'}
          </span>
          <h2 className="font-serif italic text-[52px] leading-tight text-white max-w-sm">
            {lang === 'it' ? 'Quattro suite, quattro esperienze' : 'Four suites, four experiences'}
          </h2>
          <div className="mt-12 flex items-center gap-4 text-white/30">
            <span className="text-4xl">‹</span>
            <span className="font-sans tracking-widest text-[10px] uppercase">Scroll to explore</span>
            <span className="text-4xl">›</span>
          </div>
        </div>
        <div className="w-2/3 flex items-center overflow-hidden py-12">
          <div ref={trackRef} className="flex gap-8 pr-40 pl-4">
            {property.rooms.map((room, i) => (
              <SuiteCard key={room.slug} room={room} index={i} t={t} lang={lang} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: swipeable carousel */}
      <div className="md:hidden py-16 px-6">
        <span className="text-gold font-sans tracking-[0.4em] uppercase text-xs mb-4 block font-medium">
          {lang === 'it' ? 'LE SUITE' : 'THE SUITES'}
        </span>
        <h2 className="font-serif italic text-4xl leading-tight text-white mb-8">
          {lang === 'it' ? 'Quattro suite, quattro esperienze' : 'Four suites, four experiences'}
        </h2>
        <div className="suites-mobile-track">
          {property.rooms.map((room, i) => (
            <SuiteCard key={room.slug} room={room} index={i} t={t} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PARTNER ───
function PartnerSection() {
  const { lang } = useLanguage()
  return (
    <section className="bg-[#F0EDE8] py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* Left: Image */}
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="relative group overflow-hidden">
          <div className="absolute inset-0 bg-gold/10 mix-blend-multiply z-10 transition-opacity duration-700 group-hover:opacity-0" />
          <div className="aspect-[4/5] overflow-hidden">
            <Image src="/images/sea-star-restaurant.jpg" alt="Sea Star Beach Restaurant" fill
              className="object-cover !relative w-full h-full transition-transform duration-1000 group-hover:scale-105" sizes="50vw" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r border-b border-gold/20 hidden lg:block" />
        </motion.div>
        {/* Right: Content */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }} className="flex flex-col items-start">
          <span className="font-sans text-xs text-gold tracking-[0.3em] uppercase mb-6 block font-medium">PARTNER ESCLUSIVO</span>
          <h2 className="font-serif italic text-5xl md:text-6xl text-navy leading-tight mb-8">Sea Star Beach Restaurant</h2>
          <div className="w-12 h-px bg-gold mb-10" />
          <p className="font-sans text-lg text-[#1b1c1a]/80 leading-relaxed mb-10 max-w-md">
            {lang === 'it'
              ? "A pochi passi dalla struttura, sul lido di Alghero. Cucina di mare d'eccellenza, cocktail d'autore serviti al tramonto in un'atmosfera di raffinata pace mediterranea."
              : "Steps from the property, on the Alghero lido. Exquisite seafood cuisine, signature cocktails served at sunset in an atmosphere of refined Mediterranean peace."}
          </p>
          <div className="bg-gold/5 border-l-4 border-gold p-8 mb-12 w-full max-w-md flex items-center space-x-4">
            <Gift size={20} className="text-gold flex-shrink-0" />
            <p className="font-sans text-sm tracking-widest uppercase text-navy font-medium">
              {lang === 'it' ? 'Sconto esclusivo per i nostri ospiti' : 'Exclusive discount for our guests'}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/sea_star_alghero" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold text-sm font-sans"><Instagram size={16} /> @sea_star_alghero</a>
            <a href="https://www.instagram.com/sea_star_alghero" target="_blank" rel="noopener noreferrer"
              className="relative inline-block py-2 font-sans font-light tracking-[0.2em] uppercase text-sm text-navy group">
              {lang === 'it' ? 'Scopri Sea Star →' : 'Discover Sea Star →'}
              <span className="absolute bottom-0 left-0 w-full h-px bg-gold/30 group-hover:bg-gold group-hover:h-[2px] transition-all duration-500" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── BOOKING ───
function BookingSection() {
  const { lang } = useLanguage()
  return (
    <section className="relative min-h-screen flex items-center justify-center py-24 px-6 overflow-hidden bg-navy">
      <div className="absolute inset-0 z-0">
        <Image src="/images/balcony/balcony-02.jpeg" alt="Aerial Alghero" fill className="object-cover opacity-40" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/80 to-navy" />
      </div>
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
        <span className="font-sans text-white/60 uppercase tracking-[0.4em] text-xs mb-6">
          {lang === 'it' ? 'PRENOTA IL TUO SOGGIORNO' : 'BOOK YOUR STAY'}
        </span>
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8 }} className="font-serif italic text-5xl md:text-[72px] text-white leading-tight mb-4">
          {lang === 'it' ? 'La tua suite ti aspetta' : 'Your suite awaits'}
        </motion.h2>
        <p className="font-sans font-light text-white/70 tracking-[0.07em] text-lg mb-16">
          {lang === 'it' ? 'Prenotazione diretta — senza commissioni' : 'Direct booking — no commissions'}
        </p>

        {/* Form Card — Stitch style with underline inputs */}
        <div className="w-full max-w-[600px] bg-white p-10 md:p-14 shadow-[0_40px_60px_-15px_rgba(27,28,26,0.04)]">
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col text-left">
                <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy/50 mb-2">Check-in</label>
                <input type="date" className="w-full bg-transparent border-0 border-b border-[#c4c6cd] py-2 focus:ring-0 focus:border-gold transition-colors font-sans text-navy outline-none" />
              </div>
              <div className="flex flex-col text-left">
                <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy/50 mb-2">Check-out</label>
                <input type="date" className="w-full bg-transparent border-0 border-b border-[#c4c6cd] py-2 focus:ring-0 focus:border-gold transition-colors font-sans text-navy outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="flex flex-col text-left">
                <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy/50 mb-2">{lang === 'it' ? 'Ospiti' : 'Guests'}</label>
                <select className="w-full bg-transparent border-0 border-b border-[#c4c6cd] py-2 focus:ring-0 focus:border-gold transition-colors font-sans text-navy appearance-none cursor-pointer outline-none">
                  <option>2 {lang === 'it' ? 'Adulti' : 'Adults'}</option>
                  <option>1 {lang === 'it' ? 'Adulto' : 'Adult'}</option>
                  <option>3 {lang === 'it' ? 'Ospiti' : 'Guests'}</option>
                  <option>4 {lang === 'it' ? 'Ospiti' : 'Guests'}</option>
                </select>
              </div>
              <div className="flex flex-col text-left">
                <label className="font-sans text-[10px] uppercase tracking-[0.3em] text-navy/50 mb-2">{lang === 'it' ? 'Scegli Suite' : 'Choose Suite'}</label>
                <select className="w-full bg-transparent border-0 border-b border-[#c4c6cd] py-2 focus:ring-0 focus:border-gold transition-colors font-sans text-navy appearance-none cursor-pointer outline-none">
                  {property.rooms.map(r => <option key={r.slug}>{lang === 'it' ? r.name.it : r.name.en}</option>)}
                </select>
              </div>
            </div>
            <Link href="/availability"
              className="block w-full bg-gold text-white py-6 font-sans uppercase tracking-[0.3em] text-sm hover:bg-navy transition-all duration-700 text-center group mt-4">
              {lang === 'it' ? 'Verifica Disponibilità' : 'Check Availability'} <span className="inline-block group-hover:translate-x-2 transition-transform ml-2">→</span>
            </Link>
          </div>
          {/* Trust */}
          <div className="mt-12 pt-10 border-t border-[#e4e2de]/50">
            <div className="flex justify-center items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#635BFF] text-white text-[13px] font-sans font-medium rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                Stripe
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white text-[13px] font-sans font-medium rounded-md">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple Pay
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#dadce0] text-[#3c4043] text-[13px] font-sans font-medium rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google Pay
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#dadce0] text-[#3c4043] text-[13px] font-sans font-medium rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                Bonifico
              </span>
            </div>
            <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-navy/40">
              {lang === 'it' ? 'Pagamento sicuro' : 'Secure payment'} · {lang === 'it' ? 'Cancellazione flessibile' : 'Flexible cancellation'}
            </p>
          </div>
        </div>
        <p className="mt-12 font-sans text-white/40 text-sm font-light">
          {lang === 'it' ? 'Hai bisogno di assistenza? ' : 'Need assistance? '}
          <a href="https://wa.me/393478327243" target="_blank" rel="noopener noreferrer"
            className="text-white underline underline-offset-8 decoration-gold/50 hover:decoration-gold transition-all">
            {lang === 'it' ? 'Contatta il nostro Concierge' : 'Contact our Concierge'}
          </a>
        </p>
      </div>
    </section>
  )
}

// ─── HOME ───
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <EditorialSection />
      <AboutSection />
      <MarqueeStrip />
      <SuitesSection />
      <PartnerSection />
      <BookingSection />
    </main>
  )
}
