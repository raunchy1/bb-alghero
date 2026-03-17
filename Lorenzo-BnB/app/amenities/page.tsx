'use client'

import Link from 'next/link'
import AmenityGrid from '@/components/AmenityGrid'
import CTASection from '@/components/CTASection'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AmenitiesPage() {
  const { t } = useLanguage()

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white border-b border-sand-dark">
        <div className="container-luxury">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Cosa è incluso', en: "What's included" })}</p>
          <h1 className="font-serif text-2xl sm:text-display-lg text-ocean mb-4">{t({ it: 'Servizi', en: 'Amenities' })}</h1>
          <p className="text-stone max-w-xl text-sm leading-relaxed">
            {t({ it: "Lorenzo's B&B è completamente attrezzato per un soggiorno confortevole e senza pensieri. Dal balcone privato alla colazione inclusa, ogni dettaglio è stato curato.", en: "Lorenzo's B&B is fully equipped for a comfortable and worry-free stay. From the private balcony to the included breakfast, every detail has been taken care of." })}
          </p>
        </div>
      </section>

      {/* Amenity Grid */}
      <section className="py-24">
        <div className="container-luxury">
          <AmenityGrid amenities={listingData.amenities} variant="grid" showAll={true} />
        </div>
      </section>

      {/* House Rules */}
      <section className="bg-white py-16 border-y border-sand-dark">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Regole', en: 'Rules' })}</p>
              <h2 className="font-serif text-xl sm:text-display-sm text-ocean mb-6">{t({ it: 'Regole della casa', en: 'House rules' })}</h2>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-ocean mb-3">Check-in / Check-out</h3>
                <ul className="space-y-2 text-sm text-stone">
                  <li>Check-in: {t({ it: 'dalle 15:00 alle 20:00', en: 'from 3:00 PM to 8:00 PM' })}</li>
                  <li>Check-out: {t({ it: 'entro le 11:00', en: 'by 11:00 AM' })}</li>
                  <li>{t({ it: 'Check-in autonomo con cassetta chiavi', en: 'Self check-in with key lockbox' })}</li>
                  <li>{t({ it: 'Check-in anticipato/posticipato su richiesta', en: 'Early/late check-in on request' })}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ocean mb-3">{t({ it: 'Durante il soggiorno', en: 'During your stay' })}</h3>
                <ul className="space-y-2 text-sm text-stone">
                  <li>{t({ it: 'Non si fuma in casa', en: 'No smoking indoors' })}</li>
                  <li>{t({ it: 'Niente feste o eventi', en: 'No parties or events' })}</li>
                  <li>{t({ it: 'Animali domestici non ammessi', en: 'No pets allowed' })}</li>
                  <li>{t({ it: 'Silenzio: dalle 22:00 alle 08:00', en: 'Quiet hours: 10 PM to 8 AM' })}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ocean mb-3">{t({ it: 'Incluso nel soggiorno', en: 'Included in your stay' })}</h3>
                <ul className="space-y-2 text-sm text-stone">
                  <li>{t({ it: 'Lenzuola e asciugamani', en: 'Bed linen and towels' })}</li>
                  <li>{t({ it: 'Pulizie settimanali su richiesta', en: 'Weekly cleaning on request' })}</li>
                  <li>{t({ it: 'Culla disponibile su richiesta', en: 'Cot available on request' })}</li>
                  <li>{t({ it: 'Racchette da tennis su richiesta', en: 'Tennis rackets on request' })}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-ocean mb-3">{t({ it: 'Cancellazione', en: 'Cancellation' })}</h3>
                <ul className="space-y-2 text-sm text-stone">
                  <li>{t({ it: 'Cancellazione flessibile fino a 7 giorni prima', en: 'Flexible cancellation up to 7 days before' })}</li>
                  <li>{t({ it: 'Rimborso 50% fino a 3 giorni prima', en: '50% refund up to 3 days before' })}</li>
                  <li>{t({ it: "Nessun rimborso entro 3 giorni dall'arrivo", en: 'No refund within 3 days of arrival' })}</li>
                  <li>{t({ it: 'Assicurazione viaggio consigliata', en: 'Travel insurance recommended' })}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Prezzi', en: 'Prices' })}</p>
              <h2 className="font-serif text-xl sm:text-display-sm text-ocean mb-6">{t({ it: 'Tariffe', en: 'Rates' })}</h2>
              <div className="divider" />
              <p className="text-stone text-sm leading-relaxed mb-8">
                {t({ it: 'Le tariffe variano in base alla stagione. Tutti i prezzi sono in Euro e includono le pulizie finali. Nessun costo nascosto.', en: 'Rates vary by season. All prices are in Euros and include the final cleaning fee. No hidden costs.' })}
              </p>
              <Link href="/book" className="btn-primary">
                {t({ it: 'Prenota le tue date', en: 'Book your dates' })}
              </Link>
            </div>
            <div className="space-y-4">
              {listingData.pricing.seasonalPricing.map((season) => (
                <div key={season.season} className="flex items-center justify-between py-4 px-6 bg-white border border-sand-dark">
                  <div>
                    <p className="font-medium text-ocean text-sm">{season.season}</p>
                    <p className="text-xs text-stone mt-0.5">
                      {season.months.map(m => new Date(2024, m - 1).toLocaleString('it', { month: 'short' })).join(', ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl text-ocean">€{season.price}</p>
                    <p className="text-xs text-stone">{t({ it: 'per notte', en: 'per night' })}</p>
                  </div>
                </div>
              ))}
              <div className="py-4 px-6 bg-sand-dark border border-sand-dark">
                <div className="flex justify-between text-sm text-stone">
                  <span>{t({ it: 'Pulizie finali', en: 'Cleaning fee' })}</span>
                  <span>€{listingData.pricing.cleaningFee}</span>
                </div>
                <div className="flex justify-between text-sm text-stone mt-2">
                  <span>{t({ it: 'Spese di servizio', en: 'Service fee' })}</span>
                  <span>€{listingData.pricing.serviceFee}</span>
                </div>
                <div className="flex justify-between text-sm text-ocean font-medium mt-3 pt-3 border-t border-sand">
                  <span>{t({ it: 'Soggiorno minimo', en: 'Minimum stay' })}</span>
                  <span>{listingData.pricing.minimumNights} {t({ it: 'notti', en: 'nights' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
