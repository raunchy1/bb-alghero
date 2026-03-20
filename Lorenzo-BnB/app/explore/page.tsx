'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

const articles = [
  {
    category: 'NATURA',
    image: '/images/capo-caccia.jpeg',
    title: {
      it: 'Capo Caccia — Il balcone sul Mediterraneo',
      en: 'Capo Caccia — The Mediterranean Balcony',
    },
    description: {
      it: "Il promontorio di Capo Caccia si innalza a 200 metri sul mare con falesie verticali mozzafiato. Da quassù la vista abbraccia tutta la Riviera del Corallo, con i colori del mare che cambiano dal turchese al blu profondo. Un luogo iconico della Sardegna nord-occidentale, raggiungibile in 30 minuti di auto da Alghero.",
      en: "The Capo Caccia promontory rises 200 meters above the sea with breathtaking vertical cliffs. From up here the view embraces the entire Coral Riviera, with sea colors changing from turquoise to deep blue. An iconic place in north-western Sardinia, reachable in 30 minutes by car from Alghero.",
    },
    tag: { it: '30 min da La Suite N4', en: '30 min from La Suite N4' },
  },
  {
    category: 'MERAVIGLIE NATURALI',
    image: '/images/grotte-nettuno.jpeg',
    title: {
      it: 'Grotte di Nettuno — Un mondo sotterraneo',
      en: "Neptune's Caves — An Underground World",
    },
    description: {
      it: "Tra le più grandi cavità marine d'Italia, le Grotte di Nettuno si aprono nella roccia di Capo Caccia con laghi sotterranei, stalattiti millenarie e sale di rara bellezza. Raggiungibili via mare dal porto di Alghero in 40 minuti, o a piedi scendendo i 654 gradini dell'Escala del Cabirol. Un'esperienza indimenticabile.",
      en: "Among the largest sea caves in Italy, Neptune's Caves open in the rock of Capo Caccia with underground lakes, ancient stalactites and halls of rare beauty. Reachable by sea from Alghero port in 40 minutes, or on foot descending the 654 steps of the Escala del Cabirol. An unforgettable experience.",
    },
    tag: { it: 'Escursione consigliata', en: 'Recommended excursion' },
  },
  {
    category: 'STORIA & CULTURA',
    image: '/images/centro-storico.jpeg',
    title: {
      it: 'Centro Storico — La Barcellona di Sardegna',
      en: "Old Town — The Barcelona of Sardinia",
    },
    description: {
      it: "Alghero è l'unica città sarda dove ancora oggi si parla catalano, eredità della colonizzazione aragonese del 1300. Il centro storico, racchiuso tra antiche mura e torri medievali, offre vicoli labirintici, la Cattedrale di Santa Maria e un lungomare da cartolina. La 'Barcellona della Sardegna' in tutto il suo splendore.",
      en: "Alghero is the only Sardinian city where Catalan is still spoken today, a legacy of the Aragonese colonization of the 1300s. The old town, enclosed within ancient walls and medieval towers, offers labyrinthine alleys, the Cathedral of Santa Maria and a postcard-worthy seafront.",
    },
    tag: { it: 'A piedi da La Suite N4', en: 'Walking from La Suite N4' },
  },
  {
    category: 'SPIAGGE',
    image: '/images/maria-pia.jpeg',
    title: {
      it: 'Spiaggia di Maria Pia — Sabbia bianca e pineta',
      en: 'Maria Pia Beach — White Sand and Pine Forest',
    },
    description: {
      it: "A pochi minuti dalla città, la Spiaggia di Maria Pia è una distesa di sabbia bianca circondata da una pineta profumata. Le acque calme e basse la rendono perfetta per famiglie e chi cerca relax. Tra i tratti liberi e quelli attrezzati, è una delle spiagge più amate della Riviera del Corallo.",
      en: "Just minutes from the city, Maria Pia Beach is a stretch of white sand surrounded by a fragrant pine forest. The calm, shallow waters make it perfect for families and those seeking relaxation. One of the most beloved beaches of the Coral Riviera.",
    },
    tag: { it: '10 min da La Suite N4', en: '10 min from La Suite N4' },
  },
  {
    category: 'GASTRONOMIA',
    image: '/images/cucina.jpeg',
    title: {
      it: 'Cucina Algherese — Mare e tradizione catalana',
      en: 'Alghero Cuisine — Sea and Catalan Tradition',
    },
    description: {
      it: "Alghero offre una cucina unica che fonde la tradizione sarda con le influenze catalane. L'aragosta alla catalana, la bottarga, i ricci di mare e la paella algherese sono solo alcune delle specialità da non perdere. I ristoranti sui bastioni, con vista sul tramonto, rendono ogni pasto un'esperienza memorabile.",
      en: "Alghero offers unique cuisine that blends Sardinian tradition with Catalan influences. Catalan lobster, bottarga, sea urchins and Alghero paella are just some of the specialties not to be missed. Restaurants on the bastions, with sunset views, make every meal a memorable experience.",
    },
    tag: { it: 'Esperienza gastronomica', en: 'Gastronomic experience' },
  },
  {
    category: 'TRAMONTO',
    image: '/images/tramonto-bastione.jpeg',
    title: {
      it: 'I Bastioni al Tramonto — Oro sul Mediterraneo',
      en: 'The Bastions at Sunset — Gold on the Mediterranean',
    },
    description: {
      it: "Ogni sera, i Bastioni Cristoforo Colombo e Marco Polo si trasformano in uno dei palcoscenici naturali più spettacolari del Mediterraneo. Il sole si immerge lentamente nel mare tingendo Capo Caccia di rosso e oro. Un rito quotidiano che gli algheresi vivono con un bicchiere di Vermentino in mano.",
      en: "Every evening, the Cristoforo Colombo and Marco Polo Bastions transform into one of the Mediterranean's most spectacular natural stages. The sun slowly sinks into the sea, painting Capo Caccia red and gold. A daily ritual that locals live with a glass of Vermentino in hand.",
    },
    tag: { it: 'Momento imperdibile', en: 'Unmissable moment' },
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function ExplorePage() {
  const { t, lang } = useLanguage()

  return (
    <main>
      {/* ─── HERO ─── */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden flex items-center justify-center">
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/AdobeStock_150896479.jpg"
          alt="Sardinia coastline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(10,18,30,0.75) 0%, rgba(10,18,30,0.2) 50%, rgba(10,18,30,0.3) 100%)' }} />

        <div className="relative z-10 text-center px-6 max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[11px] uppercase tracking-[0.3em] text-gold font-sans mb-5"
          >
            {lang === 'it' ? 'ALGHERO E DINTORNI' : 'ALGHERO & SURROUNDINGS'}
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)' }}
              animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
              transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif italic font-light text-white leading-[1.05]"
              style={{ fontSize: 'clamp(48px, 6vw, 80px)' }}
            >
              {lang === 'it' ? 'Esplora Alghero' : 'Explore Alghero'}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-white/75 font-sans text-base md:text-lg mt-6 max-w-xl mx-auto leading-relaxed"
          >
            {lang === 'it'
              ? 'Spiagge cristalline, grotte mozzafiato e un centro storico millenario — tutto a portata di mano'
              : 'Crystal-clear beaches, breathtaking caves and a thousand-year-old historic center — all within reach'}
          </motion.p>
        </div>
      </section>

      {/* ─── ARTICLES GRID ─── */}
      <section className="bg-ivory py-20 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Section header */}
          <div className="mb-14">
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold font-sans font-medium">
                {lang === 'it' ? 'DA SCOPRIRE' : 'TO DISCOVER'}
              </span>
              <div className="w-[50px] h-px bg-gold" />
            </div>
            <h2
              className="font-serif italic text-navy leading-[1.1]"
              style={{ fontSize: 'clamp(36px, 4vw, 48px)' }}
            >
              {lang === 'it' ? 'Le meraviglie intorno a te' : 'The wonders around you'}
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <motion.article
                key={i}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="group bg-white border border-[rgba(26,43,60,0.08)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
                style={{ borderRadius: 2 }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ paddingTop: '66%' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.image}
                    alt={t(article.title)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.04]"
                  />
                  {/* Tag badge */}
                  <span
                    className="absolute bottom-3 left-3 font-sans text-gold px-2.5 py-1"
                    style={{
                      background: 'rgba(10,18,30,0.75)',
                      fontSize: 10,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t(article.tag)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span
                    className="block font-sans text-gold mb-2"
                    style={{ fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase' }}
                  >
                    {article.category}
                  </span>

                  <h3 className="font-serif italic text-[22px] text-navy mb-3 leading-[1.3]">
                    {t(article.title)}
                  </h3>

                  <p className="font-sans text-[14px] text-[#666] leading-[1.75] mb-4">
                    {t(article.description)}
                  </p>

                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOOKING CTA ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"
            alt="Sardinia beach"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/75" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="text-[11px] uppercase tracking-[0.3em] text-gold font-sans mb-4">
            {lang === 'it' ? 'LA TUA AVVENTURA' : 'YOUR ADVENTURE'}
          </p>
          <h2
            className="font-serif italic text-white mb-6 leading-[1.1]"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            {lang === 'it' ? 'La tua avventura sarda inizia qui' : 'Your Sardinian adventure starts here'}
          </h2>
          <p className="text-white/60 font-sans text-base mb-10 max-w-md mx-auto">
            {lang === 'it'
              ? 'Prenota La Suite N4 Alghero e fai di Alghero la tua base.'
              : 'Book La Suite N4 Alghero and make Alghero your base.'}
          </p>
          <a
            href="/book"
            className="inline-flex items-center px-9 py-[14px] bg-gold text-white text-[12px] font-sans font-medium uppercase tracking-[0.2em] hover:bg-[#b8854e] transition-colors"
          >
            {lang === 'it' ? 'Prenota Ora →' : 'Book Now →'}
          </a>
        </div>
      </section>
    </main>
  )
}
