'use client'

import { useState, useEffect, Suspense, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

const MONTHS_IT = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const DAYS_IT = ['Lu','Ma','Me','Gi','Ve','Sa','Do']
const MONTHS_EN = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS_EN = ['Mo','Tu','We','Th','Fr','Sa','Su']

function getSeasonPrice(month: number) {
  if ([6, 7].includes(month)) return 590
  if ([0, 1, 2, 10, 11].includes(month)) return 320
  return 420
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function nightsBetween(ci: string, co: string) {
  return Math.round((new Date(co).getTime() - new Date(ci).getTime()) / 86400000)
}

function AvailabilityContent() {
  const { lang } = useLanguage()
  const searchParams = useSearchParams()
  const todayDate = new Date()
  todayDate.setHours(0,0,0,0)

  const MONTHS = lang === 'en' ? MONTHS_EN : MONTHS_IT
  const DAYS = lang === 'en' ? DAYS_EN : DAYS_IT

  const [viewYear, setViewYear] = useState(todayDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(todayDate.getMonth())
  const [checkin, setCheckin] = useState<string | null>(null)
  const [checkout, setCheckout] = useState<string | null>(null)
  const [guests, setGuests] = useState(2)
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/calendar').then(r => r.json()).then(d => {
      if (d.bookedDates) setBookedDates(new Set(d.bookedDates))
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const ci = searchParams.get('checkIn'), co = searchParams.get('checkOut'), g = searchParams.get('guests')
    if (ci) setCheckin(ci)
    if (co) setCheckout(co)
    if (g) setGuests(parseInt(g))
  }, [searchParams])

  const isBooked = useCallback((d: Date) => bookedDates.has(toDateStr(d)), [bookedDates])

  const prevMonth = () => { if (viewMonth === 0) { setViewYear(y => y-1); setViewMonth(11) } else setViewMonth(m => m-1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewYear(y => y+1); setViewMonth(0) } else setViewMonth(m => m+1) }

  const handleDayClick = (dateStr: string) => {
    setWarning(null)
    if (!checkin || (checkin && checkout)) {
      setCheckin(dateStr); setCheckout(null)
    } else {
      if (dateStr <= checkin) { setCheckin(dateStr); setCheckout(null); return }
      // Check no booked dates in range
      const ci = new Date(checkin), co = new Date(dateStr)
      for (let d = new Date(ci); d <= co; d.setDate(d.getDate()+1)) {
        if (bookedDates.has(toDateStr(d))) {
          setWarning(lang === 'it' ? 'Le date selezionate includono giorni non disponibili' : 'Selected dates include unavailable days')
          return
        }
      }
      setCheckout(dateStr)
    }
  }

  const step = !checkin ? 1 : !checkout ? 1 : 3
  const nights = checkin && checkout ? nightsBetween(checkin, checkout) : 0
  const pricePerNight = checkin ? getSeasonPrice(new Date(checkin).getMonth()) : 0
  const basePrice = pricePerNight * nights
  const cleaningFee = 30
  const serviceFee = 15
  const discount = nights >= 7 ? Math.round(basePrice * 0.1) : 0
  const total = basePrice - discount + cleaningFee + serviceFee

  const formatDateDisplay = (str: string | null) => {
    if (!str) return '— —'
    const [y,m,d] = str.split('-')
    return `${d}/${m}/${y}`
  }

  // Render a single month
  const renderMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month+1, 0).getDate()
    let firstDow = new Date(year, month, 1).getDay()
    firstDow = firstDow === 0 ? 6 : firstDow - 1 // Monday = 0

    const cells = []
    for (let i = 0; i < firstDow; i++) cells.push(<div key={`e${month}-${i}`} className="cal-day empty" />)

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d)
      const dateStr = toDateStr(date)
      const isPast = date < todayDate
      const booked = isBooked(date)
      const isToday = date.toDateString() === new Date().toDateString()

      let cls = 'cal-day'
      if (isToday) cls += ' today'
      if (isPast) cls += ' past'
      else if (booked) cls += ' booked'
      else if (checkin && checkout) {
        if (dateStr === checkin) cls += ' range-start'
        else if (dateStr === checkout) cls += ' range-end'
        else if (dateStr > checkin && dateStr < checkout) cls += ' in-range'
      } else if (dateStr === checkin) cls += ' selected'

      cells.push(
        <div
          key={`d${month}-${d}`}
          className={cls}
          onClick={() => !isPast && !booked && handleDayClick(dateStr)}
        >
          {d}
        </div>
      )
    }
    return cells
  }

  const nextM = viewMonth === 11 ? 0 : viewMonth + 1
  const nextY = viewMonth === 11 ? viewYear + 1 : viewYear

  return (
    <div className="min-h-screen pt-24" style={{ background: '#F5EFE0', fontFamily: "'Jost', var(--font-jost), sans-serif" }}>
      <style>{`
        .cal-day { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 13px; border-radius: 8px; cursor: pointer; transition: all .15s; position: relative; user-select: none; }
        .cal-day:hover:not(.booked):not(.past):not(.empty) { background: #F5EFE0; }
        .cal-day.empty { cursor: default; }
        .cal-day.past { color: rgba(92,79,58,.3); cursor: not-allowed; }
        .cal-day.booked { background: rgba(155,34,38,.08); color: rgba(155,34,38,.5); cursor: not-allowed; text-decoration: line-through; }
        .cal-day.booked::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: rgba(155,34,38,.4); }
        .cal-day.selected { background: #C4935A; color: #FDFAF4; font-weight: 500; }
        .cal-day.in-range { background: rgba(196,147,90,.15); color: #2C2416; border-radius: 0; }
        .cal-day.range-start { border-radius: 8px 0 0 8px; background: #C4935A; color: #FDFAF4; font-weight: 500; }
        .cal-day.range-end { border-radius: 0 8px 8px 0; background: #C4935A; color: #FDFAF4; font-weight: 500; }
        .cal-day.range-start.range-end { border-radius: 8px; }
        .cal-day.today { font-weight: 500; box-shadow: inset 0 0 0 1.5px #C4935A; }
      `}</style>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px 60px' }}>
        {/* Header */}
        <p style={{ fontSize: 14, color: '#5C4F3A', marginBottom: 6 }}>La Suite N4 · Alghero, Sardegna</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif", fontSize: 40, fontWeight: 300, marginBottom: 40 }}>
          {lang === 'it' ? 'Prenota la tua ' : 'Book your '}
          <em style={{ color: '#C4935A' }}>{lang === 'it' ? 'vacanza' : 'vacation'}</em>
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' }} className="booking-grid">
          {/* LEFT — Calendar */}
          <div>
            {/* Month 1 */}
            <div style={{ background: '#FDFAF4', borderRadius: 16, border: '1px solid #EDE4CF', overflow: 'hidden', marginBottom: 16 }}>
              <div style={{ padding: '24px 28px 0' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif", fontSize: 22, fontWeight: 400, marginBottom: 4 }}>
                  {lang === 'it' ? 'Scegli le date' : 'Choose dates'}
                </div>
                <div style={{ fontSize: 13, color: '#5C4F3A' }}>
                  {lang === 'it' ? 'Seleziona check-in e check-out — le date in rosso non sono disponibili' : 'Select check-in and check-out — red dates are unavailable'}
                </div>
              </div>

              {/* Nav */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px 12px' }}>
                <button onClick={prevMonth} style={{ background: 'none', border: '1px solid #EDE4CF', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#5C4F3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
                <div style={{ fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif", fontSize: 20, fontWeight: 400 }}>{MONTHS[viewMonth]} {viewYear}</div>
                <button onClick={nextMonth} style={{ background: 'none', border: '1px solid #EDE4CF', borderRadius: 6, width: 32, height: 32, cursor: 'pointer', fontSize: 16, color: '#5C4F3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
              </div>

              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
                  {DAYS.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: '#5C4F3A', padding: '6px 0' }}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                  {renderMonth(viewYear, viewMonth)}
                </div>
              </div>

              {/* Warning */}
              {warning && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '10px 14px', borderRadius: 8, margin: '0 28px 16px', background: 'rgba(155,34,38,.08)', color: '#9B2226' }}>
                  ⚠ {warning}
                </div>
              )}

              {/* Legend */}
              <div style={{ display: 'flex', gap: 20, padding: '0 28px 20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5C4F3A' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#F5EFE0', border: '1px solid #EDE4CF' }} />
                  {lang === 'it' ? 'Disponibile' : 'Available'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5C4F3A' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(155,34,38,.12)' }} />
                  {lang === 'it' ? 'Non disponibile' : 'Unavailable'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#5C4F3A' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#C4935A' }} />
                  {lang === 'it' ? 'Selezionato' : 'Selected'}
                </div>
              </div>
            </div>

            {/* Month 2 */}
            <div style={{ background: '#FDFAF4', borderRadius: 16, border: '1px solid #EDE4CF', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 28px 12px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif", fontSize: 20, fontWeight: 400 }}>{MONTHS[nextM]} {nextY}</div>
              </div>
              <div style={{ padding: '0 20px 20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
                  {DAYS.map(d => <div key={`2${d}`} style={{ textAlign: 'center', fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: '#5C4F3A', padding: '6px 0' }}>{d}</div>)}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                  {renderMonth(nextY, nextM)}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Sidebar */}
          <div style={{ background: '#FDFAF4', borderRadius: 16, border: '1px solid #EDE4CF', overflow: 'hidden' }}>
            <div style={{ padding: 28 }}>
              {/* Steps */}
              <div style={{ display: 'flex', marginBottom: 24, border: '1px solid #EDE4CF', borderRadius: 10, overflow: 'hidden' }}>
                {[
                  { n: 1, label: lang === 'it' ? '① Date' : '① Dates' },
                  { n: 2, label: lang === 'it' ? '② Ospiti' : '② Guests' },
                  { n: 3, label: lang === 'it' ? '③ Prenota' : '③ Book' },
                ].map(s => (
                  <div key={s.n} style={{
                    flex: 1, padding: 10, textAlign: 'center', fontSize: 12, fontWeight: 500,
                    color: s.n < step ? '#2D6A4F' : s.n === step ? '#C4935A' : '#5C4F3A',
                    background: s.n < step ? 'rgba(45,106,79,.06)' : s.n === step ? '#FDFAF4' : '#F5EFE0',
                    borderRight: s.n < 3 ? '1px solid #EDE4CF' : 'none',
                    transition: 'all .2s',
                  }}>
                    {s.label}
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif", fontSize: 22, fontWeight: 300, marginBottom: 20 }}>
                {lang === 'it' ? 'Riepilogo' : 'Summary'}
              </h3>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <div style={{ background: '#F5EFE0', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5C4F3A', marginBottom: 4 }}>Check-in</div>
                  <div style={{ fontSize: 15, fontWeight: checkin ? 500 : 300, color: checkin ? '#2C2416' : 'rgba(92,79,58,.4)' }}>{formatDateDisplay(checkin)}</div>
                </div>
                <div style={{ background: '#F5EFE0', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: '#5C4F3A', marginBottom: 4 }}>Check-out</div>
                  <div style={{ fontSize: 15, fontWeight: checkout ? 500 : 300, color: checkout ? '#2C2416' : 'rgba(92,79,58,.4)' }}>{formatDateDisplay(checkout)}</div>
                </div>
              </div>

              {/* Guests */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EDE4CF', marginBottom: 16 }}>
                <span style={{ fontSize: 14 }}>{lang === 'it' ? 'Ospiti adulti' : 'Adult guests'}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button onClick={() => setGuests(g => Math.max(1, g-1))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #EDE4CF', background: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5C4F3A' }}>−</button>
                  <span style={{ fontSize: 16, fontWeight: 500, minWidth: 20, textAlign: 'center' }}>{guests}</span>
                  <button onClick={() => setGuests(g => Math.min(8, g+1))} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #EDE4CF', background: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5C4F3A' }}>+</button>
                </div>
              </div>

              {/* Price breakdown */}
              {nights > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '10px 0', borderBottom: '1px solid #EDE4CF' }}>
                    <span style={{ color: '#5C4F3A' }}>€{pricePerNight} × {nights} {lang === 'it' ? 'notti' : 'nights'}</span>
                    <span>€{basePrice}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '10px 0', borderBottom: '1px solid #EDE4CF' }}>
                    <span style={{ color: '#5C4F3A' }}>{lang === 'it' ? 'Pulizie finali' : 'Cleaning fee'}</span>
                    <span>€{cleaningFee}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '10px 0', borderBottom: '1px solid #EDE4CF' }}>
                    <span style={{ color: '#5C4F3A' }}>{lang === 'it' ? 'Spese di servizio' : 'Service fee'}</span>
                    <span>€{serviceFee}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, padding: '10px 0', borderBottom: '1px solid #EDE4CF' }}>
                      <span style={{ color: '#5C4F3A' }}>{lang === 'it' ? 'Sconto 7+ notti' : '7+ nights discount'} <span style={{ background: 'rgba(45,106,79,.1)', color: '#2D6A4F', fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 20 }}>–10%</span></span>
                      <span style={{ color: '#2D6A4F' }}>–€{discount}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '16px 0 20px', borderTop: '2px solid #2C2416', marginTop: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '.05em' }}>{lang === 'it' ? 'Totale' : 'Total'}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif", fontSize: 36, fontWeight: 300 }}>€{total}</span>
                  </div>

                  <Link
                    href={`/book?checkIn=${checkin}&checkOut=${checkout}&guests=${guests}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      width: '100%', background: '#C4935A', color: '#FDFAF4', border: 'none',
                      fontFamily: "'Jost', var(--font-jost), sans-serif", fontSize: 15, fontWeight: 500, letterSpacing: '.03em',
                      padding: 18, borderRadius: 8, textDecoration: 'none',
                      transition: 'opacity .2s, transform .2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
                  >
                    {lang === 'it' ? `Prenota ora — €${total}` : `Book now — €${total}`}
                  </Link>

                  <p style={{ fontSize: 12, color: '#5C4F3A', textAlign: 'center', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ opacity: .5 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                    {lang === 'it' ? 'Pagamento sicuro · Cancellazione flessibile' : 'Secure payment · Flexible cancellation'}
                  </p>
                </>
              ) : (
                <p style={{ fontSize: 14, color: '#5C4F3A', padding: '16px 0', fontStyle: 'italic', fontFamily: "'Cormorant Garamond', var(--font-cormorant), serif" }}>
                  {lang === 'it' ? 'Seleziona le date per vedere il prezzo...' : 'Select dates to see pricing...'}
                </p>
              )}

              {/* WhatsApp alternative */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #EDE4CF', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: '#5C4F3A', marginBottom: 8 }}>{lang === 'it' ? 'Oppure contattaci direttamente' : 'Or contact us directly'}</p>
                <a href="https://wa.me/393478327243" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: '#2D6A4F', textDecoration: 'none' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="#2D6A4F"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp Concierge
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F5EFE0', paddingTop: 120, textAlign: 'center', color: '#5C4F3A', fontSize: 14 }}>Caricamento...</div>}>
      <AvailabilityContent />
    </Suspense>
  )
}
