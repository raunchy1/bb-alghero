'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/bookings`)
        .then(r => r.json())
        .then(bookings => {
          const found = bookings.find((b: any) => b.stripeSessionId === sessionId)
          if (found) setBooking(found)
        })
        .catch(() => {})
    }
  }, [sessionId])

  return (
    <main className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-navy rounded-none flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-normal tracking-tighter text-navy mb-4 leading-tight">
          Prenotazione confermata
        </h1>
        <p className="text-lg text-muted mb-10">
          Grazie per la tua prenotazione. Riceverai una conferma via email.
        </p>

        {booking && (
          <div className="bg-white rounded-none p-6 mb-10 text-left ">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1">Camera</p>
                <p className="text-navy">{booking.room?.name || '—'}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1">Ospiti</p>
                <p className="text-navy">{booking.guests}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1">Check-in</p>
                <p className="text-navy">{new Date(booking.checkIn).toLocaleDateString('it-IT')}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1">Check-out</p>
                <p className="text-navy">{new Date(booking.checkOut).toLocaleDateString('it-IT')}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1">Notti</p>
                <p className="text-navy">{booking.nights}</p>
              </div>
              <div>
                <p className="text-muted text-xs uppercase tracking-[0.15em] mb-1">Totale</p>
                <p className="text-navy font-medium">€{booking.totalPrice}</p>
              </div>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="inline-block px-8 py-4 bg-navy text-ivory text-sm tracking-[0.15em] uppercase rounded-none hover:bg-[#272220] transition-colors"
        >
          Torna alla home
        </Link>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#094730]/20 border-t-[#094730] rounded-none animate-spin" />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  )
}
