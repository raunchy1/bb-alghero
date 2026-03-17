'use client'

import { useEffect, useState } from 'react'

interface Room {
  id: number
  name: string
}

interface Booking {
  id: number
  roomId: number
  room: Room
  guestName: string
  guestEmail: string
  checkIn: string
  checkOut: string
  guests: number
  nights: number
  totalPrice: number
  paymentStatus: string
  createdAt: string
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then((r) => r.json())
      .then((data) => {
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a: Booking, b: Booking) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setBookings(sorted)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-grey text-sm">Caricamento...</div>
  }

  return (
    <div>
      <h1 className="text-display-sm text-dark mb-1">Prenotazioni</h1>
      <p className="text-grey text-sm mb-8">Tutte le prenotazioni della struttura</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="px-6 py-8 text-center text-grey text-sm">
            Nessuna prenotazione ancora
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-grey uppercase tracking-wider border-b border-light-grey">
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Camera</th>
                  <th className="px-6 py-3 font-medium">Ospite</th>
                  <th className="px-6 py-3 font-medium">Check-in</th>
                  <th className="px-6 py-3 font-medium">Check-out</th>
                  <th className="px-6 py-3 font-medium">Notti</th>
                  <th className="px-6 py-3 font-medium">Totale</th>
                  <th className="px-6 py-3 font-medium">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-grey">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-cream/50 transition-colors">
                    <td className="px-6 py-3.5 text-grey">#{booking.id}</td>
                    <td className="px-6 py-3.5 text-dark font-medium">
                      {booking.room?.name || `Camera ${booking.roomId}`}
                    </td>
                    <td className="px-6 py-3.5 text-dark">
                      <div>{booking.guestName || '—'}</div>
                      {booking.guestEmail && (
                        <div className="text-xs text-grey">{booking.guestEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-grey">
                      {new Date(booking.checkIn).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-3.5 text-grey">
                      {new Date(booking.checkOut).toLocaleDateString('it-IT')}
                    </td>
                    <td className="px-6 py-3.5 text-grey">{booking.nights}</td>
                    <td className="px-6 py-3.5 text-dark font-medium">€{booking.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${statusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
