'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

interface BookingDetails {
  id: number
  guestName: string
  room: { name: string }
  checkIn: string
  checkOut: string
}

function CheckInContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id')
  
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    documentType: 'passport',
    documentNumber: '',
    nationality: '',
    birthDate: '',
    phone: '',
  })
  const [submitted, setSubmitted] = useState(false)
  
  useEffect(() => {
    if (bookingId) {
      fetch(`/api/checkin?id=${bookingId}`)
        .then(r => r.json())
        .then(data => {
          setBooking(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [bookingId])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingId,
        ...formData,
      }),
    })
    
    if (res.ok) {
      setSubmitted(true)
    }
  }
  
  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Caricamento...</div>
  }
  
  if (!bookingId || !booking) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 40, textAlign: 'center' }}>
        <h1>Check-in Digitale</h1>
        <p>Inserisci il numero della tua prenotazione:</p>
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            const id = (e.target as HTMLFormElement).bookingId.value
            window.location.href = `/checkin?id=${id}`
          }}
          style={{ marginTop: 24 }}
        >
          <input
            name="bookingId"
            type="text"
            placeholder="Numero prenotazione"
            style={{
              padding: '12px 16px',
              fontSize: 16,
              border: '1px solid #ddd',
              borderRadius: 4,
              width: 200,
              marginRight: 12,
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#C4935A',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            Continua
          </button>
        </form>
      </div>
    )
  }
  
  if (submitted) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', padding: 40, textAlign: 'center' }}>
        <CheckCircle size={64} color="#22c55e" style={{ margin: '0 auto 24px' }} />
        <h1 style={{ color: '#1A2B3C', marginBottom: 16 }}>Check-in Completato!</h1>
        <p style={{ color: '#666', lineHeight: 1.6 }}>
          Grazie {booking.guestName}! Il tuo check-in è stato registrato.<br />
          All'arrivo, potrai accedere direttamente alla tua camera.<br />
          <br />
          <strong>Camera:</strong> {booking.room.name}<br />
          <strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString('it-IT')} dalle 15:00
        </p>
      </div>
    )
  }
  
  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ color: '#1A2B3C' }}>Check-in Digitale</h1>
        <p style={{ color: '#666' }}>Completa le informazioni per un check-in veloce</p>
      </div>
      
      {/* Booking Summary */}
      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>Riepilogo Prenotazione #{booking.id}</h3>
        <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Ospite:</strong> {booking.guestName}</p>
        <p style={{ margin: '4px 0', fontSize: 14 }}><strong>Camera:</strong> {booking.room.name}</p>
        <p style={{ margin: '4px 0', fontSize: 14 }}>
          <strong>Date:</strong> {new Date(booking.checkIn).toLocaleDateString('it-IT')} - {new Date(booking.checkOut).toLocaleDateString('it-IT')}
        </p>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Tipo Documento
          </label>
          <select
            value={formData.documentType}
            onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            <option value="passport">Passaporto</option>
            <option value="id_card">Carta d&apos;Identità</option>
            <option value="drivers_license">Patente</option>
          </select>
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Numero Documento *
          </label>
          <input
            type="text"
            required
            value={formData.documentNumber}
            onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Nazionalità *
          </label>
          <input
            type="text"
            required
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Data di Nascita *
          </label>
          <input
            type="date"
            required
            value={formData.birthDate}
            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>
        
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>
            Telefono
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#C4935A',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Completa Check-in
        </button>
      </form>
    </div>
  )
}

export default function CheckInPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>Caricamento...</div>}>
      <CheckInContent />
    </Suspense>
  )
}
