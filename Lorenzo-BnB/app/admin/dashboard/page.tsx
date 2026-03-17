'use client'

import { useEffect, useState } from 'react'

interface Room {
  id: number
  name: string
  slug: string
  price: number
  capacity: number
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

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/rooms').then((r) => r.json()),
      fetch('/api/bookings').then((r) => r.json()),
    ])
      .then(([roomsData, bookingsData]) => {
        setRooms(Array.isArray(roomsData) ? roomsData : [])
        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === 'paid')
    .reduce((sum, b) => sum + b.totalPrice, 0)

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

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
      <h1 className="text-display-sm text-dark mb-1">Dashboard</h1>
      <p className="text-grey text-sm mb-8">Panoramica della struttura</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-grey font-medium uppercase tracking-wider mb-1">Prenotazioni</p>
          <p className="text-3xl font-semibold text-dark">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-grey font-medium uppercase tracking-wider mb-1">Entrate totali</p>
          <p className="text-3xl font-semibold text-dark">€{totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-xs text-grey font-medium uppercase tracking-wider mb-1">Camere</p>
          <p className="text-3xl font-semibold text-dark">{rooms.length}</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-light-grey">
          <h2 className="text-sm font-semibold text-dark">Prenotazioni recenti</h2>
        </div>

        {recentBookings.length === 0 ? (
          <div className="px-6 py-8 text-center text-grey text-sm">
            Nessuna prenotazione ancora
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-grey uppercase tracking-wider border-b border-light-grey">
                <th className="px-6 py-3 font-medium">Ospite</th>
                <th className="px-6 py-3 font-medium">Camera</th>
                <th className="px-6 py-3 font-medium">Check-in</th>
                <th className="px-6 py-3 font-medium">Totale</th>
                <th className="px-6 py-3 font-medium">Stato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-grey">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-cream/50 transition-colors">
                  <td className="px-6 py-3.5 text-dark font-medium">{booking.guestName || '—'}</td>
                  <td className="px-6 py-3.5 text-grey">{booking.room?.name || `Camera ${booking.roomId}`}</td>
                  <td className="px-6 py-3.5 text-grey">
                    {new Date(booking.checkIn).toLocaleDateString('it-IT')}
                  </td>
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
        )}
      </div>
    </div>
  )
}
