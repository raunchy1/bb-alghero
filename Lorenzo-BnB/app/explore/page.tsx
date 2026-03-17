'use client'

import Image from 'next/image'
import ExploreSardinia from '@/components/ExploreSardinia'
import CTASection from '@/components/CTASection'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ExplorePage() {
  const { t } = useLanguage()

  const travelTips = [
    {
      title: t({ it: 'Come arrivare', en: 'Getting there' }),
      text: t({ it: "Aeroporto di Alghero-Fertilia (AHO), a pochi km dal centro. Noleggio auto consigliato per esplorare la costa.", en: "Alghero-Fertilia Airport (AHO), just a few km from the center. Car rental recommended to explore the coast." }),
    },
    {
      title: t({ it: 'Periodo migliore', en: 'Best time to visit' }),
      text: t({ it: "Maggio–Giugno e Settembre–Ottobre: clima perfetto, meno folla e prezzi più bassi. Luglio–Agosto è l'alta stagione.", en: "May–June and September–October: perfect weather, fewer crowds and lower prices. July–August is peak season." }),
    },
    {
      title: t({ it: 'Spostarsi', en: 'Getting around' }),
      text: t({ it: "A piedi per il centro storico e le spiagge vicine, in auto per esplorare Capo Caccia e la Riviera del Corallo.", en: "Walk to the old town and nearby beaches, drive to explore Capo Caccia and the Coral Riviera." }),
    },
    {
      title: t({ it: 'Valuta locale', en: 'Local currency' }),
      text: t({ it: 'Euro (€). Carte accettate ovunque, ma tieni qualche contante per i mercatini e i chioschi in spiaggia.', en: 'Euro (€). Cards accepted everywhere, but keep some cash for markets and beach kiosks.' }),
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/lu-impostu-san-teodoro-puntaldia-veduta-aerea425718108.jpg.webp"
            alt="Lu Impostu San Teodoro"
            fill priority className="object-cover object-center" sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="relative z-10 container-luxury pb-16">
          <p className="text-xs font-medium tracking-widest uppercase text-white/70 mb-3">{t({ it: 'La tua destinazione', en: 'Your destination' })}</p>
          <h1 className="font-serif text-2xl sm:text-display-lg lg:text-display-xl text-white">{t({ it: 'Esplora la Sardegna', en: 'Explore Sardinia' })}</h1>
          <p className="text-white/80 text-lg mt-2 max-w-lg">
            {t({ it: 'Alghero e dintorni — spiagge, grotte, centro storico catalano e natura selvaggia.', en: 'Alghero and surroundings — beaches, caves, Catalan old town and wild nature.' })}
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white border-b border-sand-dark">
        <div className="container-luxury">
          <div className="max-w-3xl">
            <p className="text-stone leading-relaxed text-base">
              {t({ it: "La Sardegna non è solo una destinazione — è uno stato d'animo. Alghero offre alcune delle coste più spettacolari d'Europa, un centro storico catalano unico, cucina genuina e un ritmo di vita davvero rigenerante. Lorenzo's B&B è al centro di tutto: spiagge dorate, Capo Caccia, le Grotte di Nettuno e una natura incontaminata — tutto a portata di mano.", en: "Sardinia is not just a destination — it's a state of mind. Alghero offers some of Europe's most spectacular coastlines, a unique Catalan old town, genuine cuisine and a truly rejuvenating pace of life. Lorenzo's B&B is at the heart of it all: golden beaches, Capo Caccia, Neptune's Grotto and unspoilt nature — all within easy reach." })}
            </p>
          </div>
        </div>
      </section>

      {/* Explore Content */}
      <section className="py-24 lg:py-32">
        <div className="container-luxury">
          <ExploreSardinia />
        </div>
      </section>

      {/* Travel Tips */}
      <section className="bg-ocean py-16">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {travelTips.map(({ title, text }) => (
              <div key={title}>
                <div className="w-8 h-px bg-sunset mb-4" />
                <h3 className="font-medium text-sand text-sm mb-3">{title}</h3>
                <p className="text-sand/60 text-xs leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={t({ it: 'La tua avventura sarda inizia qui', en: 'Your Sardinian adventure starts here' })}
        subtitle={t({ it: "Prenota Lorenzo's B&B e fai di Alghero la tua base.", en: "Book Lorenzo's B&B and make Alghero your base." })}
      />
    </>
  )
}
