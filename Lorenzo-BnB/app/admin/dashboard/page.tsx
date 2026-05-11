'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BedDouble, Image, CreditCard } from 'lucide-react'

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

const cardStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid rgba(26,43,60,0.08)',
  padding: 24,
}

const labelStyle: React.CSSProperties = {
  fontFamily: "'Figtree', sans-serif",
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(26,43,60,0.4)',
  margin: '0 0 4px 0',
}

const numberStyle: React.CSSProperties = {
  fontFamily: "'Cormorant', serif",
  fontSize: 36,
  color: 'oklch(22% 0.01 75)',
  fontWeight: 500,
  margin: 0,
}

const actionBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  border: '1px solid #C4935A',
  color: 'oklch(58% 0.12 42)',
  backgroundColor: 'transparent',
  padding: '10px 20px',
  fontFamily: "'Figtree', sans-serif",
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s',
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

  const nextCheckIn = bookings
    .filter((b) => new Date(b.checkIn) >= new Date())
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())[0]

  const statusLabel = (status: string) => {
    switch (status) {
      case 'paid': return { text: 'Pagato', bg: '#dcfce7', color: '#166534' }
      case 'pending': return { text: 'In attesa', bg: '#fef9c3', color: '#854d0e' }
      case 'cancelled': return { text: 'Annullato', bg: '#fee2e2', color: '#991b1b' }
      default: return { text: status, bg: '#f3f4f6', color: '#374151' }
    }
  }

  if (loading) {
    return (
      <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.5)' }}>
        Caricamento...
      </p>
    )
  }

  return (
    <div>
      <h1
        style={{
          fontFamily: "'Cormorant', serif",
          fontStyle: 'italic',
          fontSize: 32,
          color: 'oklch(22% 0.01 75)',
          fontWeight: 500,
          margin: '0 0 24px 0',
        }}
      >
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <div style={cardStyle}>
          <p style={labelStyle}>Prenotazioni</p>
          <p style={numberStyle}>{bookings.length}</p>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Entrate Totali</p>
          <p style={numberStyle}>&euro;{totalRevenue.toLocaleString('it-IT', { minimumFractionDigits: 0 })}</p>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Suite Attive</p>
          <p style={numberStyle}>{rooms.length}</p>
        </div>
        <div style={cardStyle}>
          <p style={labelStyle}>Prossimo Check-in</p>
          <p style={{ ...numberStyle, fontSize: nextCheckIn ? 24 : 36 }}>
            {nextCheckIn ? new Date(nextCheckIn.checkIn).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }) : '--'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-8">
        <Link href="/admin/suite" style={actionBtnStyle} className="text-center justify-center text-[11px] md:text-[12px] py-3">
          <BedDouble size={16} strokeWidth={1.5} /> Suite
        </Link>
        <Link href="/admin/galleria" style={actionBtnStyle} className="text-center justify-center text-[11px] md:text-[12px] py-3">
          <Image size={16} strokeWidth={1.5} /> Galleria
        </Link>
        <Link href="/admin/pagamenti" style={actionBtnStyle} className="col-span-2 md:col-span-1 text-center justify-center text-[11px] md:text-[12px] py-3">
          <CreditCard size={16} strokeWidth={1.5} /> Stripe
        </Link>
      </div>

      {/* Test Payment Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        borderRadius: 8, 
        padding: '16px 20px',
        marginBottom: 24,
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>🧪 Testează Plata Stripe</p>
            <p style={{ margin: '4px 0 0 0', fontSize: 12, opacity: 0.9 }}>Fă un test cu 1 EUR pentru a verifica integrarea</p>
          </div>
          <a 
            href="/test-plata" 
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'white',
              color: '#764ba2',
              padding: '10px 20px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            Testează Acum →
          </a>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(26,43,60,0.08)' }}>
          <h2 style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, color: 'oklch(22% 0.01 75)', fontWeight: 600, margin: 0 }}>
            Prenotazioni recenti
          </h2>
        </div>

        {recentBookings.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', fontFamily: "'Figtree', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.4)' }}>
            Nessuna prenotazione ancora
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table style={{ width: '100%', minWidth: 500, borderCollapse: 'collapse', fontFamily: "'Figtree', sans-serif", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(26,43,60,0.08)' }}>
                    {['Ospite', 'Camera', 'Check-in', 'Totale', 'Stato'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,43,60,0.4)', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => {
                    const s = statusLabel(booking.paymentStatus)
                    return (
                      <tr key={booking.id} style={{ borderBottom: '1px solid rgba(26,43,60,0.05)' }}>
                        <td style={{ padding: '12px 16px', color: 'oklch(22% 0.01 75)', fontWeight: 500 }}>{booking.guestName || '--'}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(26,43,60,0.6)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{booking.room?.name || `Camera ${booking.roomId}`}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(26,43,60,0.6)' }}>{new Date(booking.checkIn).toLocaleDateString('it-IT')}</td>
                        <td style={{ padding: '12px 16px', color: 'oklch(22% 0.01 75)', fontWeight: 500 }}>&euro;{booking.totalPrice.toFixed(2)}</td>
                        <td style={{ padding: '12px 16px' }}><span style={{ display: 'inline-block', padding: '4px 10px', fontSize: 11, fontWeight: 500, backgroundColor: s.bg, color: s.color, borderRadius: 4 }}>{s.text}</span></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden p-4 space-y-3">
              {recentBookings.map((booking) => {
                const s = statusLabel(booking.paymentStatus)
                return (
                  <div key={booking.id} style={{ background: '#FAF8F4', border: '1px solid rgba(26,43,60,0.08)', borderRadius: 4, padding: 16, fontFamily: "'Figtree', sans-serif" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: 14, color: 'oklch(22% 0.01 75)' }}>{booking.guestName || '--'}</span>
                      <span style={{ color: 'oklch(58% 0.12 42)', fontWeight: 600, fontSize: 14 }}>&euro;{booking.totalPrice.toFixed(2)}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>{booking.room?.name || `Camera ${booking.roomId}`}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span style={{ fontSize: 12, color: '#888' }}>Check-in: {new Date(booking.checkIn).toLocaleDateString('it-IT')}</span>
                      <span style={{ padding: '3px 8px', fontSize: 10, fontWeight: 500, backgroundColor: s.bg, color: s.color, borderRadius: 4 }}>{s.text}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
