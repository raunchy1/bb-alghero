'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Users, ChevronLeft, ChevronRight, Info } from 'lucide-react'
import clsx from 'clsx'
import listingData from '@/data/listingData.json'
import { useLanguage } from '@/contexts/LanguageContext'

const MONTHS_IT = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']


const DAYS_IT = ['Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa', 'Do']
const DAYS_EN = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']


// Simulated booked ranges (for demo)
const BOOKED_RANGES = [
  { start: new Date(2025, 6, 10), end: new Date(2025, 6, 18) },
  { start: new Date(2025, 7, 1), end: new Date(2025, 7, 12) },
  { start: new Date(2025, 7, 20), end: new Date(2025, 7, 28) },
  { start: new Date(2025, 8, 5), end: new Date(2025, 8, 10) },
]

function isBooked(date: Date): boolean {
  return BOOKED_RANGES.some(
    range => date >= range.start && date <= range.end
  )
}

function getSeasonPrice(month: number): number {
  const lowMonths = [0, 1, 2, 10, 11]
  const highMonths = [6, 7]
  if (lowMonths.includes(month)) return 320
  if (highMonths.includes(month)) return 590
  return 420
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function AvailabilityContent() {
  const { t, lang } = useLanguage()
  const searchParams = useSearchParams()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const MONTHS = lang === 'en' ? MONTHS_EN : MONTHS_IT
  const DAYS = lang === 'en' ? DAYS_EN : DAYS_IT

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [checkIn, setCheckIn] = useState<Date | null>(null)
  const [checkOut, setCheckOut] = useState<Date | null>(null)
  const [hoverDate, setHoverDate] = useState<Date | null>(null)
  const [guests, setGuests] = useState(2)

  useEffect(() => {
    const ci = searchParams.get('checkIn')
    const co = searchParams.get('checkOut')
    const g = searchParams.get('guests')
    if (ci) setCheckIn(new Date(ci))
    if (co) setCheckOut(new Date(co))
    if (g) setGuests(parseInt(g))
  }, [searchParams])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const handleDateClick = (date: Date) => {
    if (isBooked(date) || date < today) return
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date)
      setCheckOut(null)
    } else {
      if (date < checkIn) {
        setCheckIn(date)
        setCheckOut(null)
      } else {
        setCheckOut(date)
      }
    }
  }

  const isInRange = (date: Date) => {
    if (!checkIn) return false
    const end = checkOut || hoverDate
    if (!end) return false
    return date > checkIn && date < end
  }

  const isSelected = (date: Date) => {
    if (checkIn && date.toDateString() === checkIn.toDateString()) return 'start'
    if (checkOut && date.toDateString() === checkOut.toDateString()) return 'end'
    return false
  }

  const nights = checkIn && checkOut
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000)
    : 0

  const seasonPrice = checkIn ? getSeasonPrice(checkIn.getMonth()) : listingData.pricing.basePrice
  const subtotal = nights * seasonPrice
  const total = subtotal + listingData.pricing.cleaningFee + listingData.pricing.serviceFee

  const renderCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const adjustedFirstDay = (firstDay + 6) % 7 // Monday start

    const cells = []

    // Empty cells
    for (let i = 0; i < adjustedFirstDay; i++) {
      cells.push(<div key={`empty-${i}`} />)
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      const isPast = date < today
      const booked = isBooked(date)
      const selState = isSelected(date)
      const inRange = isInRange(date)

      cells.push(
        <button
          key={d}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => checkIn && !checkOut && setHoverDate(date)}
          onMouseLeave={() => setHoverDate(null)}
          disabled={isPast || booked}
          className={clsx(
            'relative h-10 w-full text-sm transition-all duration-150 font-medium',
            isPast || booked
              ? 'text-stone/40 cursor-not-allowed'
              : 'cursor-pointer hover:bg-ocean hover:text-sand',
            selState === 'start' || selState === 'end'
              ? 'bg-ocean text-sand'
              : inRange
              ? 'bg-ocean/10 text-ocean'
              : !isPast && !booked
              ? 'text-ocean'
              : '',
            booked && !isPast && 'line-through'
          )}
        >
          {d}
        </button>
      )
    }

    return cells
  }

  const formatDate = (date: Date | null) => {
    if (!date) return '—'
    const locale = lang === 'en' ? 'en-GB' : 'it-IT'
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-sand pt-24">
      {/* Header */}
      <div className="bg-white border-b border-sand-dark">
        <div className="container-luxury py-12">
          <p className="text-xs font-medium tracking-widest uppercase text-stone mb-4">{t({ it: 'Pianifica il soggiorno', en: 'Plan your stay' })}</p>
          <h1 className="font-serif text-display-lg text-ocean">{t({ it: 'Verifica disponibilità', en: 'Check availability' })}</h1>
        </div>
      </div>

      <div className="container-luxury py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Calendar */}
          <div className="lg:col-span-2">
            {/* Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button onClick={prevMonth} className="p-2 hover:bg-sand-dark transition-colors rounded-sm">
                <ChevronLeft size={20} className="text-ocean" />
              </button>
              <h2 className="font-serif text-xl text-ocean">
                {MONTHS[viewMonth]} {viewYear}
              </h2>
              <button onClick={nextMonth} className="p-2 hover:bg-sand-dark transition-colors rounded-sm">
                <ChevronRight size={20} className="text-ocean" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map(d => (
                <div key={d} className="text-center text-xs font-medium text-stone py-2">{d}</div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar(viewYear, viewMonth)}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-6 text-xs text-stone">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-ocean" />
                <span>{t({ it: 'Selezionato', en: 'Selected' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-ocean/10" />
                <span>{t({ it: 'Il tuo soggiorno', en: 'Your stay' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-sand-dark" />
                <span>{t({ it: 'Non disponibile', en: 'Unavailable' })}</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-white border border-sand-dark flex items-start gap-3">
              <Info size={16} className="text-ocean flex-shrink-0 mt-0.5" />
              <p className="text-xs text-stone">
                {t({ it: `Questo calendario mostra la disponibilità indicativa. La disponibilità confermata e il prezzo esatto verranno comunicati dopo la prenotazione. Soggiorno minimo: ${listingData.pricing.minimumNights} notti.`, en: `This calendar shows indicative availability. Confirmed availability and exact price will be communicated after booking. Minimum stay: ${listingData.pricing.minimumNights} nights.` })}
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white border border-sand-dark p-6 sticky top-24">
              <h3 className="font-serif text-xl text-ocean mb-6">{t({ it: 'Il tuo soggiorno', en: 'Your stay' })}</h3>

              <div className="space-y-4 mb-6">
                <div className="p-4 border border-sand-dark">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={14} className="text-sunset" />
                    <span className="text-xs font-medium tracking-widest uppercase text-stone">{t({ it: 'Arrivo', en: 'Check-in' })}</span>
                  </div>
                  <p className="text-sm text-ocean">{formatDate(checkIn)}</p>
                </div>
                <div className="p-4 border border-sand-dark">
                  <div className="flex items-center gap-2 mb-1">
                    <CalendarDays size={14} className="text-sunset" />
                    <span className="text-xs font-medium tracking-widest uppercase text-stone">{t({ it: 'Partenza', en: 'Check-out' })}</span>
                  </div>
                  <p className="text-sm text-ocean">{formatDate(checkOut)}</p>
                </div>
                <div className="p-4 border border-sand-dark">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={14} className="text-sunset" />
                    <span className="text-xs font-medium tracking-widest uppercase text-stone">{t({ it: 'Ospiti', en: 'Guests' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setGuests(g => Math.max(1, g - 1))}
                      className="w-7 h-7 border border-sand-dark flex items-center justify-center text-ocean hover:bg-sand-dark"
                    >−</button>
                    <span className="text-sm text-ocean">{guests}</span>
                    <button
                      onClick={() => setGuests(g => Math.min(6, g + 1))}
                      className="w-7 h-7 border border-sand-dark flex items-center justify-center text-ocean hover:bg-sand-dark"
                    >+</button>
                  </div>
                </div>
              </div>

              {nights >= listingData.pricing.minimumNights && (
                <div className="border-t border-sand-dark pt-4 mb-6 space-y-2 text-sm">
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

              {nights > 0 && nights < listingData.pricing.minimumNights && (
                <p className="text-xs text-red-500 mb-4 flex items-center gap-1">
                  <Info size={12} /> {t({ it: `Minimo ${listingData.pricing.minimumNights} notti richieste`, en: `Minimum ${listingData.pricing.minimumNights} nights required` })}
                </p>
              )}

              {checkIn && checkOut && nights >= listingData.pricing.minimumNights ? (
                <Link
                  href={`/book?checkIn=${checkIn.toISOString().split('T')[0]}&checkOut=${checkOut.toISOString().split('T')[0]}&guests=${guests}`}
                  className="btn-primary w-full justify-center"
                >
                  {t({ it: 'Continua con la prenotazione', en: 'Continue to booking' })}
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full py-3 bg-sand-dark text-stone text-xs font-medium tracking-widest uppercase cursor-not-allowed"
                >
                  {!checkIn
                    ? t({ it: 'Seleziona data di arrivo', en: 'Select check-in date' })
                    : !checkOut
                    ? t({ it: 'Seleziona data di partenza', en: 'Select check-out date' })
                    : t({ it: `Minimo ${listingData.pricing.minimumNights} notti`, en: `Minimum ${listingData.pricing.minimumNights} nights` })}
                </button>
              )}

              <p className="text-xs text-stone text-center mt-3">{t({ it: 'Non ti verrà addebitato nulla ora', en: "You won't be charged anything now" })}</p>

              <div className="mt-4 pt-4 border-t border-sand-dark text-center">
                <p className="text-xs text-stone mb-2">{t({ it: 'O prenota su', en: 'Or book on' })}</p>
                <a
                  href={listingData.airbnbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-ocean hover:text-sunset transition-colors uppercase tracking-widest"
                >
                  Airbnb →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-stone">Loading...</div>}>
      <AvailabilityContent />
    </Suspense>
  )
}
