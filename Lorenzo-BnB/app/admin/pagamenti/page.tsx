'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Check, X } from 'lucide-react'

interface Room {
  id: number
  name: string
  slug: string
  price: number
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(26,43,60,0.15)',
  borderRadius: 4,
  padding: '10px 14px',
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const sectionLabel: React.CSSProperties = {
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(26,43,60,0.4)',
  margin: '0 0 4px 0',
}

export default function PagamentiPage() {
  const [publishableKey, setPublishableKey] = useState('')
  const [secretKey, setSecretKey] = useState('')
  const [mode, setMode] = useState('test')
  const [rooms, setRooms] = useState<Room[]>([])
  const [roomPrices, setRoomPrices] = useState<Record<number, number>>({})
  const [paymentMethods, setPaymentMethods] = useState({ carta: true, applePay: false, googlePay: false, bonifico: false })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.stripePublishableKey) setPublishableKey(data.stripePublishableKey)
        if (data.stripeSecretKey) setSecretKey(data.stripeSecretKey)
        if (data.stripeMode) setMode(data.stripeMode)
      })
      .catch(console.error)

    fetch('/api/rooms')
      .then((r) => r.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setRooms(arr)
        const prices: Record<number, number> = {}
        arr.forEach((r: Room) => { prices[r.id] = r.price })
        setRoomPrices(prices)
      })
      .catch(console.error)
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveStripe = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stripePublishableKey: publishableKey, stripeSecretKey: secretKey, stripeMode: mode }),
      })
      if (res.ok) showToast('Configurazione Stripe salvata', 'success')
      else showToast('Errore nel salvataggio', 'error')
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleSavePrice = async (room: Room) => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: room.id, price: roomPrices[room.id] }),
      })
      if (res.ok) showToast(`Prezzo aggiornato per ${room.name}`, 'success')
      else showToast('Errore nel salvataggio', 'error')
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  return (
    <div>
      <h1
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: 32,
          color: '#1A2B3C',
          fontWeight: 500,
          margin: '0 0 24px 0',
        }}
      >
        Pagamenti
      </h1>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            padding: '12px 20px',
            backgroundColor: '#fff',
            border: `1px solid ${toast.type === 'success' ? '#16a34a' : '#ef4444'}`,
            color: toast.type === 'success' ? '#16a34a' : '#ef4444',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Section 1: Stripe Config */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <CreditCard size={20} strokeWidth={1.5} color="#C4935A" />
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: 0 }}>
            Connetti Stripe
          </h2>
        </div>

        <div
          style={{
            border: '1px solid #C4935A',
            padding: 16,
            marginBottom: 20,
            backgroundColor: 'rgba(196,147,90,0.03)',
          }}
        >
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: '#1A2B3C', margin: 0, lineHeight: 1.6 }}>
            Per configurare i pagamenti, accedi alla{' '}
            <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" style={{ color: '#C4935A' }}>
              Dashboard Stripe
            </a>{' '}
            e copia le chiavi API dalla sezione Developers &gt; API Keys.
            Usa le chiavi di test per provare e quelle live per i pagamenti reali.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 16, marginBottom: 20 }}>
          <div>
            <p style={sectionLabel}>Publishable Key</p>
            <input
              type="text"
              value={publishableKey}
              onChange={(e) => setPublishableKey(e.target.value)}
              placeholder="pk_live_..."
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
            />
          </div>
          <div>
            <p style={sectionLabel}>Secret Key</p>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_..."
              style={inputStyle}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
            />
          </div>
          <div>
            <p style={sectionLabel}>Modalita</p>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="test">Test</option>
              <option value="live">Live</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveStripe}
          style={{
            backgroundColor: '#C4935A',
            color: '#fff',
            border: 'none',
            borderRadius: 2,
            padding: '12px 24px',
            fontFamily: "'Jost', sans-serif",
            fontSize: 13,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b38249' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C4935A' }}
        >
          Salva Configurazione Stripe
        </button>
      </div>

      {/* Section 2: Payment Methods */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          Metodi di Pagamento
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { key: 'carta', label: 'Carta' },
            { key: 'applePay', label: 'Apple Pay' },
            { key: 'googlePay', label: 'Google Pay' },
            { key: 'bonifico', label: 'Bonifico' },
          ].map((m) => (
            <div key={m.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', border: '1px solid rgba(26,43,60,0.08)' }}>
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#1A2B3C' }}>{m.label}</span>
              <button
                onClick={() => setPaymentMethods((prev) => ({ ...prev, [m.key]: !prev[m.key as keyof typeof prev] }))}
                style={{
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: paymentMethods[m.key as keyof typeof paymentMethods] ? '#16a34a' : '#ccc',
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background-color 0.2s',
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    top: 2,
                    left: paymentMethods[m.key as keyof typeof paymentMethods] ? 18 : 2,
                    transition: 'left 0.2s',
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Pricing */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24 }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          Tariffe Suite
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {rooms.map((room) => (
            <div key={room.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid rgba(26,43,60,0.05)' }}>
              <span style={{ flex: 1, fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#1A2B3C' }}>{room.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.5)' }}>&euro;</span>
                <input
                  type="number"
                  value={roomPrices[room.id] || 0}
                  onChange={(e) => setRoomPrices((prev) => ({ ...prev, [room.id]: Number(e.target.value) }))}
                  style={{ ...inputStyle, width: 100 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
                />
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.4)' }}>/ notte</span>
                <button
                  onClick={() => handleSavePrice(room)}
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid rgba(26,43,60,0.2)',
                    borderRadius: 2,
                    padding: '8px 16px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 12,
                    color: '#1A2B3C',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C4935A'; e.currentTarget.style.color = '#C4935A' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.2)'; e.currentTarget.style.color = '#1A2B3C' }}
                >
                  Salva
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
