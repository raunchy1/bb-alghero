'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Users, Check, ExternalLink, Gift } from 'lucide-react'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

function BookContent() {
  const { t } = useLanguage()
  const searchParams = useSearchParams()
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''
  const guestsParam = parseInt(searchParams.get('guests') || '2')

  const [step, setStep] = useState<'details' | 'confirm' | 'success'>('details')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    arrivalTime: '',
    guests: guestsParam,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const nights = checkIn && checkOut
    ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0

  const seasonPrice = checkIn ? (() => {
    const m = new Date(checkIn).getMonth()
    if ([0,1,2,10,11].includes(m)) return 320
    if ([6,7].includes(m)) return 590
    return 420
  })() : listingData.pricing.basePrice

  const subtotal = nights * seasonPrice
  const total = subtotal + listingData.pricing.cleaningFee + listingData.pricing.serviceFee

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    const req = t({ it: 'Campo obbligatorio', en: 'Required field' })
    if (!form.firstName.trim()) errs.firstName = req
    if (!form.lastName.trim()) errs.lastName = req
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/)) errs.email = t({ it: 'Email valida richiesta', en: 'Valid email required' })
    if (!form.phone.trim()) errs.phone = req
    return errs
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setStep('confirm')
  }

  const handleConfirm = () => {
    setStep('success')
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-sand pt-24 flex items-center justify-center">
        <div className="container-luxury py-16 text-center max-w-lg">
          <div className="w-16 h-16 bg-ocean/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-ocean" />
          </div>
          <h2 className="font-serif text-display-sm text-ocean mb-4">{t({ it: 'Richiesta inviata!', en: 'Request sent!' })}</h2>
          <p className="text-stone mb-4">
            {t({ it: `Grazie, ${form.firstName}. La tua richiesta di prenotazione è stata ricevuta. Riceverai conferma entro 24 ore.`, en: `Thank you, ${form.firstName}. Your booking request has been received. You will receive confirmation within 24 hours.` })}
          </p>
          <p className="text-sm text-stone mb-8">
            {t({ it: 'Una conferma sarà inviata a', en: 'A confirmation will be sent to' })} <strong className="text-ocean">{form.email}</strong>.
          </p>
          <div className="bg-white border border-sand-dark p-6 text-left mb-8">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-stone">{t({ it: 'Arrivo', en: 'Check-in' })}</span>
                <span className="text-ocean font-medium">{formatDate(checkIn)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">{t({ it: 'Partenza', en: 'Check-out' })}</span>
                <span className="text-ocean font-medium">{formatDate(checkOut)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">{t({ it: 'Ospiti', en: 'Guests' })}</span>
                <span className="text-ocean font-medium">{form.guests}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-sand-dark font-medium">
                <span className="text-stone">{t({ it: 'Totale', en: 'Total' })}</span>
                <span className="text-ocean">€{total}</span>
              </div>
            </div>
          </div>
          <Link href="/" className="btn-primary">
            {t({ it: 'Torna alla home', en: 'Back to home' })}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand pt-24">
      <div className="bg-white border-b border-sand-dark">
        <div className="container-luxury py-10">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Prenotazione', en: 'Booking' })}</p>
          <h1 className="font-serif text-display-md text-ocean">{t({ it: 'Prenota La Suite N4 Alghero', en: 'Book La Suite N4 Alghero' })}</h1>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {!checkIn || !checkOut ? (
              <div className="bg-white border border-sand-dark p-8 text-center">
                <p className="text-stone mb-4">{t({ it: 'Seleziona prima le tue date.', en: 'Please select your dates first.' })}</p>
                <Link href="/availability" className="btn-primary">
                  {t({ it: 'Verifica disponibilità', en: 'Check availability' })}
                </Link>
              </div>
            ) : (
              <>
                {step === 'details' && (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Personal Info */}
                    <div className="bg-white border border-sand-dark p-6">
                      <h2 className="font-serif text-xl text-ocean mb-6">{t({ it: 'I tuoi dati', en: 'Your details' })}</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">{t({ it: 'Nome *', en: 'First name *' })}</label>
                          <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))}
                            className="input-luxury"
                            placeholder="Sophie"
                          />
                          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">{t({ it: 'Cognome *', en: 'Last name *' })}</label>
                          <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))}
                            className="input-luxury"
                            placeholder="Laurent"
                          />
                          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">Email *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                            className="input-luxury"
                            placeholder="sophie@example.com"
                          />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">{t({ it: 'Telefono *', en: 'Phone *' })}</label>
                          <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                            className="input-luxury"
                            placeholder="+33 6 12 34 56 78"
                          />
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">{t({ it: 'Orario di arrivo stimato', en: 'Estimated arrival time' })}</label>
                          <input
                            type="time"
                            value={form.arrivalTime}
                            onChange={(e) => setForm(f => ({ ...f, arrivalTime: e.target.value }))}
                            className="input-luxury"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">{t({ it: 'Ospiti', en: 'Guests' })}</label>
                          <select
                            value={form.guests}
                            onChange={(e) => setForm(f => ({ ...f, guests: parseInt(e.target.value) }))}
                            className="input-luxury"
                          >
                            {[1,2,3,4,5,6].map(n => (
                              <option key={n} value={n}>{n} {n === 1 ? t({ it: 'ospite', en: 'guest' }) : t({ it: 'ospiti', en: 'guests' })}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-xs font-medium tracking-widest uppercase text-stone block mb-2">{t({ it: "Messaggio all'host (opzionale)", en: 'Message to host (optional)' })}</label>
                        <textarea
                          value={form.message}
                          onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                          className="input-luxury resize-none"
                          rows={4}
                          placeholder={t({ it: 'Raccontaci del tuo viaggio...', en: 'Tell us about your trip...' })}
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center py-4">
                      {t({ it: 'Rivedi prenotazione', en: 'Review booking' })}
                    </button>

                    <p className="text-xs text-stone text-center">
                      {t({ it: 'Continuando accetti i nostri termini di prenotazione.', en: 'By continuing you accept our booking terms.' })}
                    </p>
                  </form>
                )}

                {step === 'confirm' && (
                  <div className="space-y-6">
                    <div className="bg-white border border-sand-dark p-6">
                      <h2 className="font-serif text-xl text-ocean mb-6">{t({ it: 'Conferma la tua prenotazione', en: 'Confirm your booking' })}</h2>
                      <dl className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">{t({ it: 'Nome ospite', en: 'Guest name' })}</dt>
                          <dd className="text-ocean font-medium">{form.firstName} {form.lastName}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">Email</dt>
                          <dd className="text-ocean">{form.email}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">{t({ it: 'Telefono', en: 'Phone' })}</dt>
                          <dd className="text-ocean">{form.phone}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">{t({ it: 'Arrivo', en: 'Check-in' })}</dt>
                          <dd className="text-ocean">{formatDate(checkIn)}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">{t({ it: 'Partenza', en: 'Check-out' })}</dt>
                          <dd className="text-ocean">{formatDate(checkOut)}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">{t({ it: 'Notti', en: 'Nights' })}</dt>
                          <dd className="text-ocean">{nights}</dd>
                        </div>
                        <div className="flex justify-between py-2 border-b border-sand-dark">
                          <dt className="text-stone">{t({ it: 'Ospiti', en: 'Guests' })}</dt>
                          <dd className="text-ocean">{form.guests}</dd>
                        </div>
                        <div className="flex justify-between py-2 font-medium">
                          <dt className="text-ocean">{t({ it: 'Totale', en: 'Total' })}</dt>
                          <dd className="text-ocean">€{total}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setStep('details')}
                        className="btn-outline flex-1 justify-center"
                      >
                        {t({ it: 'Modifica dati', en: 'Edit details' })}
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="btn-primary flex-1 justify-center"
                      >
                        {t({ it: 'Conferma prenotazione', en: 'Confirm booking' })}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Summary Sidebar */}
          <div>
            <div className="bg-white border border-sand-dark p-6 sticky top-24">
              <div className="relative aspect-[4/3] overflow-hidden mb-6">
                <Image
                  src={listingData.images.gallery[0].url}
                  alt="La Suite N4 Alghero"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>

              <h3 className="font-serif text-lg text-ocean mb-1">La Suite N4 Alghero</h3>
              <p className="text-xs text-stone mb-4">{listingData.location.city}, {listingData.location.region}</p>

              <div className="border-t border-sand-dark pt-4 space-y-3 text-sm mb-6">
                {checkIn && (
                  <div className="flex items-center gap-2 text-stone">
                    <CalendarDays size={14} className="text-sunset" />
                    <span>{formatDate(checkIn)} – {formatDate(checkOut)}</span>
                  </div>
                )}
                {nights > 0 && (
                  <div className="flex items-center gap-2 text-stone">
                    <Users size={14} className="text-sunset" />
                    <span>{form.guests} {form.guests === 1 ? t({ it: 'ospite', en: 'guest' }) : t({ it: 'ospiti', en: 'guests' })} · {nights} {nights === 1 ? t({ it: 'notte', en: 'night' }) : t({ it: 'notti', en: 'nights' })}</span>
                  </div>
                )}
              </div>

              {nights > 0 && (
                <div className="space-y-2 text-sm border-t border-sand-dark pt-4 mb-4">
                  <div className="flex justify-between text-stone">
                    <span>€{seasonPrice} × {nights} {nights === 1 ? t({ it: 'notte', en: 'night' }) : t({ it: 'notti', en: 'nights' })}</span>
                    <span>€{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-stone">
                    <span>{t({ it: 'Pulizie finali', en: 'Cleaning fee' })}</span>
                    <span>€{listingData.pricing.cleaningFee}</span>
                  </div>
                  <div className="flex justify-between text-stone">
                    <span>{t({ it: 'Spese di servizio', en: 'Service fee' })}</span>
                    <span>€{listingData.pricing.serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-medium text-ocean pt-2 border-t border-sand-dark">
                    <span>{t({ it: 'Totale', en: 'Total' })}</span>
                    <span>€{total}</span>
                  </div>
                </div>
              )}

              <a
                href={listingData.airbnbUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 border border-sand-dark text-ocean text-xs font-medium tracking-widest uppercase hover:bg-sand transition-colors"
              >
                <ExternalLink size={14} />
                {t({ it: 'Prenota via Airbnb', en: 'Book via Airbnb' })}
              </a>

              {/* Payment Methods */}
              <div style={{
                display: 'flex', gap: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 16,
                opacity: 0.6,
                fontSize: 12,
                fontFamily: 'var(--font-jost), Jost, sans-serif'
              }}>
                <span>{t({ it: 'Pagamenti sicuri:', en: 'Secure payments:' })}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/stripe.svg" height={20} alt="Stripe" style={{ height: 20 }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/apple-pay.svg" height={20} alt="Apple Pay" style={{ height: 20 }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/google-pay.svg" height={20} alt="Google Pay" style={{ height: 20 }} />
                <span>{t({ it: 'Bonifico', en: 'Bank transfer' })}</span>
              </div>

              {/* Bonifico Bancario */}
              <div 
                className="mt-4 p-4 rounded-lg"
                style={{
                  background: 'rgba(14, 165, 233, 0.06)',
                  borderLeft: '3px solid #0ea5e9',
                }}
              >
                <p className="text-xs font-medium tracking-widest uppercase text-stone mb-2">
                  {t({ it: 'Pagamento tramite Bonifico Bancario', en: 'Bank Transfer Payment' })}
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone">IBAN:</span>
                    <span className="text-ocean font-mono">IT71A0306984893100000009177</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone">{t({ it: 'Intestato a:', en: 'Account holder:' })}</span>
                    <span className="text-ocean">{t({ it: '[da aggiornare]', en: '[to be updated]' })}</span>
                  </div>
                </div>
                <p className="text-xs text-stone mt-2 italic">
                  {t({ it: 'La prenotazione si conferma alla ricezione del pagamento.', en: 'Booking confirmed upon payment receipt.' })}
                </p>
              </div>

              {/* Sconto Ristorante */}
              <div
                className="mt-4 p-4 rounded-lg text-center"
                style={{
                  background: 'rgba(196, 147, 90, 0.08)',
                  border: '1px solid #C4935A',
                }}
              >
                <div className="flex justify-center mb-2">
                  <Gift size={16} color="#C4935A" />
                </div>
                <p className="text-xs text-[#1a1716]" style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', fontStyle: 'italic' }}>
                  {t({
                    it: 'Prenota direttamente e ricevi uno sconto al Sea Star Beach Restaurant.',
                    en: 'Book directly and receive a discount at Sea Star Beach Restaurant.'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-stone">Loading...</div>}>
      <BookContent />
    </Suspense>
  )
}
