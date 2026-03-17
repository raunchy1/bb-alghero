'use client'

import { property } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const { lang } = useLanguage()
  const { contact, location } = property

  return (
    <main className="bg-[#f5f4ef] min-h-screen">
      {/* ─── HEADER ─── */}
      <section className="pt-32 pb-12 md:pt-44 md:pb-16 px-6 md:px-12">
        <div className="max-w-[1624px] mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-4">
            {lang === 'it' ? 'Contatti' : 'Contact'}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-tighter text-[#1a1716] leading-[0.95]">
            {lang === 'it' ? 'Contattaci' : 'Get in touch'}
          </h1>
        </div>
      </section>

      {/* ─── TWO COLUMNS ─── */}
      <section className="px-6 md:px-12 pb-28 md:pb-44">
        <div className="max-w-[1624px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left — Contact Info */}
            <div className="space-y-12">
              {/* Phone */}
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-3">
                  {lang === 'it' ? 'Telefono' : 'Phone'}
                </p>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-2xl md:text-3xl text-[#1a1716] hover:text-[#094730] transition-colors duration-300 tracking-tight"
                >
                  {contact.phone}
                </a>
              </div>

              {/* WhatsApp */}
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-3">
                  WhatsApp
                </p>
                <a
                  href={`https://wa.me/${contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl md:text-3xl text-[#1a1716] hover:text-[#094730] transition-colors duration-300 tracking-tight"
                >
                  {lang === 'it' ? 'Scrivici su WhatsApp' : 'Message us on WhatsApp'}
                </a>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-3">
                  Email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-2xl md:text-3xl text-[#1a1716] hover:text-[#094730] transition-colors duration-300 tracking-tight"
                >
                  {contact.email}
                </a>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-3">
                  {lang === 'it' ? 'Posizione' : 'Location'}
                </p>
                <p className="text-2xl md:text-3xl text-[#1a1716] tracking-tight">
                  {location.city}, {location.region}
                </p>
                <p className="text-[#9e9790] text-base mt-2">
                  {location.distanceToSea} {lang === 'it' ? 'dal mare' : 'from the sea'}
                </p>
              </div>

              {/* CIN */}
              <div>
                <p className="text-xs tracking-[0.25em] uppercase text-[#9e9790] mb-3">
                  CIN
                </p>
                <p className="text-base text-[#1a1716] font-mono tracking-wide">
                  {contact.cin}
                </p>
              </div>

              {/* Airbnb CTA */}
              <div className="pt-4">
                <a
                  href={contact.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-10 py-5 bg-[#1a1716] text-[#f5f4ef] text-sm tracking-[0.15em] uppercase rounded-lg hover:bg-[#272220] transition-colors duration-300"
                >
                  {lang === 'it' ? 'Prenota su Airbnb' : 'Book on Airbnb'}
                </a>
              </div>
            </div>

            {/* Right — Map */}
            <div>
              <div className="relative w-full aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden">
                <iframe
                  title="Google Maps"
                  src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d${location.coordinates.lng}!3d${location.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sit!2sit!4v1700000000000!5m2!1sit!2sit`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
              <p className="text-xs text-[#9e9790] mt-4 tracking-wide">
                {location.city}, {location.region}, {location.country}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
