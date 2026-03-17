'use client'

import { useState, useMemo } from 'react'
import { property } from '@/data/rooms'
import { useLanguage } from '@/contexts/LanguageContext'

interface BookingFormProps {
  preselectedRoom?: string
  variant?: 'inline' | 'card'
}

export default function BookingForm({ preselectedRoom, variant = 'card' }: BookingFormProps) {
  const { t, lang } = useLanguage()

  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  const [checkIn, setCheckIn] = useState(today)
  const [checkOut, setCheckOut] = useState(tomorrow)
  const [roomSlug, setRoomSlug] = useState(preselectedRoom || property.rooms[0].slug)
  const [guests, setGuests] = useState(2)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedRoom = useMemo(
    () => property.rooms.find((r) => r.slug === roomSlug),
    [roomSlug]
  )

  const nights = useMemo(() => {
    const d1 = new Date(checkIn)
    const d2 = new Date(checkOut)
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / 86400000)
    return diff > 0 ? diff : 0
  }, [checkIn, checkOut])

  // Price estimation from static data
  const estimatedPrice = useMemo(() => {
    if (!selectedRoom) return 0
    const priceMap: Record<string, number> = {
      'suite-luxury-tripla': 120,
      'suite-luxury-4-pax': 150,
      'stanza-luxury-3-pax': 110,
      'stanza-luxury-2-pax': 90,
    }
    return (priceMap[selectedRoom.slug] || 90) * nights
  }, [selectedRoom, nights])

  function validate(): boolean {
    setError('')
    if (!checkIn || !checkOut) {
      setError(lang === 'it' ? 'Seleziona le date' : 'Select dates')
      return false
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError(lang === 'it' ? 'Il check-out deve essere dopo il check-in' : 'Check-out must be after check-in')
      return false
    }
    if (new Date(checkIn) < new Date(today)) {
      setError(lang === 'it' ? 'La data non può essere nel passato' : 'Date cannot be in the past')
      return false
    }
    if (!selectedRoom) return false
    return true
  }

  function handleWhatsApp() {
    if (!validate() || !selectedRoom) return

    const roomName = t(selectedRoom.name)
    const fmt = (d: string) => new Date(d).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })

    const message = lang === 'it'
      ? `Buongiorno, vorrei prenotare:\n\n🏨 Camera: ${roomName}\n👥 Ospiti: ${guests}\n📅 Check-in: ${fmt(checkIn)}\n📅 Check-out: ${fmt(checkOut)}\n🌙 Notti: ${nights}\n💰 Stima: €${estimatedPrice}\n\nPotete confermare la disponibilità? Grazie.`
      : `Hello, I would like to book:\n\n🏨 Room: ${roomName}\n👥 Guests: ${guests}\n📅 Check-in: ${fmt(checkIn)}\n📅 Check-out: ${fmt(checkOut)}\n🌙 Nights: ${nights}\n💰 Estimate: €${estimatedPrice}\n\nPlease confirm availability. Thank you.`

    window.open(`https://wa.me/${property.contact.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
  }

  async function handleStripeCheckout() {
    if (!validate() || !selectedRoom) return
    setLoading(true)
    setError('')

    try {
      // 1. Create booking in DB
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomSlug,
          checkIn,
          checkOut,
          guests,
          guestName: guestName || 'Guest',
          guestEmail: guestEmail || '',
        }),
      })
      const booking = await bookingRes.json()
      if (!bookingRes.ok) throw new Error(booking.error || 'Booking failed')

      // 2. Create Stripe checkout session
      const checkoutRes = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id }),
      })
      const checkout = await checkoutRes.json()

      if (!checkoutRes.ok || !checkout.url) {
        // Stripe not configured — fallback to WhatsApp
        if (checkout.error?.includes('not configured') || checkout.error?.includes('Stripe')) {
          handleWhatsApp()
          return
        }
        throw new Error(checkout.error || 'Checkout failed')
      }

      // 3. Redirect to Stripe
      window.location.href = checkout.url
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const isCard = variant === 'card'
  const inputCls = 'w-full px-4 py-3.5 bg-[#f5f4ef] border border-[#eee7df] rounded-lg text-[#1a1716] text-sm focus:outline-none focus:border-[#094730] transition-colors'

  return (
    <div className={isCard ? 'bg-white rounded-2xl p-8 md:p-10 shadow-[0_2px_20px_rgba(0,0,0,0.06)]' : ''}>
      {isCard && (
        <h3 className="text-2xl md:text-3xl font-normal tracking-tighter text-[#1a1716] mb-8 leading-tight">
          {lang === 'it' ? 'Prenota il tuo soggiorno' : 'Book your stay'}
        </h3>
      )}

      <div className={`grid gap-5 ${isCard ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9790] mb-2">Check-in</label>
          <input type="date" value={checkIn} min={today} onChange={(e) => { setCheckIn(e.target.value); setError('') }} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9790] mb-2">Check-out</label>
          <input type="date" value={checkOut} min={checkIn || today} onChange={(e) => { setCheckOut(e.target.value); setError('') }} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9790] mb-2">{lang === 'it' ? 'Camera' : 'Room'}</label>
          <select value={roomSlug} onChange={(e) => { setRoomSlug(e.target.value); const r = property.rooms.find(r => r.slug === e.target.value); if (r && guests > r.capacity.guests) setGuests(r.capacity.guests); setError('') }} className={`${inputCls} appearance-none`}>
            {property.rooms.map((r) => (
              <option key={r.slug} value={r.slug}>{t(r.name)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9790] mb-2">{lang === 'it' ? 'Ospiti' : 'Guests'}</label>
          <select value={guests} onChange={(e) => { setGuests(Number(e.target.value)); setError('') }} className={`${inputCls} appearance-none`}>
            {Array.from({ length: selectedRoom?.capacity.guests || 4 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? (lang === 'it' ? 'ospite' : 'guest') : (lang === 'it' ? 'ospiti' : 'guests')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Guest info for Stripe */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 mt-5">
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9790] mb-2">{lang === 'it' ? 'Nome' : 'Name'}</label>
          <input type="text" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder={lang === 'it' ? 'Il tuo nome' : 'Your name'} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs tracking-[0.2em] uppercase text-[#9e9790] mb-2">Email</label>
          <input type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder={lang === 'it' ? 'La tua email' : 'Your email'} className={inputCls} />
        </div>
      </div>

      {/* Price estimate + nights */}
      {nights > 0 && (
        <div className="mt-6 p-4 bg-[#f5f4ef] rounded-lg flex items-center justify-between">
          <div className="text-sm text-[#9e9790]">
            {nights} {nights === 1 ? (lang === 'it' ? 'notte' : 'night') : (lang === 'it' ? 'notti' : 'nights')}
          </div>
          <div className="text-right">
            <p className="text-2xl font-normal text-[#1a1716] tracking-tight">€{estimatedPrice}</p>
            <p className="text-xs text-[#9e9790]">{lang === 'it' ? 'stima totale' : 'estimated total'}</p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {/* Action buttons */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Stripe / Pay Online */}
        <button
          onClick={handleStripeCheckout}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#1a1716] text-[#f5f4ef] text-sm font-medium tracking-[0.1em] uppercase rounded-lg hover:bg-[#272220] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          )}
          {loading
            ? (lang === 'it' ? 'Attendere...' : 'Loading...')
            : (lang === 'it' ? 'Paga online' : 'Pay online')}
        </button>

        {/* WhatsApp */}
        <button
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white text-sm font-medium tracking-[0.1em] uppercase rounded-lg hover:bg-[#20bd5a] active:scale-[0.98] transition-all duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          WhatsApp
        </button>
      </div>
    </div>
  )
}
