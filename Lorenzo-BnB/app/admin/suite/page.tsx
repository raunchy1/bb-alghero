'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, Save, Check, X } from 'lucide-react'

interface Room {
  id: number
  name: string
  slug: string
  price: number
  capacity: number
  images?: string[]
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

export default function SuitePage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [editData, setEditData] = useState<Record<number, { name: string; price: number; capacity: number }>>({})
  const [availability, setAvailability] = useState<Record<number, boolean>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({})

  useEffect(() => {
    fetch('/api/rooms')
      .then((r) => r.json())
      .then((data) => {
        const roomsArr = Array.isArray(data) ? data : []
        setRooms(roomsArr)
        const edits: Record<number, { name: string; price: number; capacity: number }> = {}
        const avail: Record<number, boolean> = {}
        roomsArr.forEach((r: Room) => {
          edits[r.id] = { name: r.name, price: r.price, capacity: r.capacity }
          const stored = localStorage.getItem(`room_avail_${r.id}`)
          avail[r.id] = stored !== null ? stored === 'true' : true
        })
        setEditData(edits)
        setAvailability(avail)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (room: Room) => {
    const ed = editData[room.id]
    if (!ed) return
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: room.id, name: ed.name, price: ed.price, capacity: ed.capacity }),
      })
      if (res.ok) {
        showToast('Suite aggiornata con successo', 'success')
        setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, ...ed } : r)))
      } else {
        showToast('Errore nel salvataggio', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleFileUpload = async (roomSlug: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('roomSlug', roomSlug)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        const data = await res.json()
        setRooms((prev) =>
          prev.map((r) =>
            r.slug === roomSlug ? { ...r, images: [...(r.images || []), data.path] } : r
          )
        )
        showToast('Foto caricata', 'success')
      } else {
        showToast('Errore nel caricamento', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const toggleAvailability = (id: number) => {
    setAvailability((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      localStorage.setItem(`room_avail_${id}`, String(next[id]))
      return next
    })
  }

  if (loading) {
    return <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.5)' }}>Caricamento...</p>
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
        Le Suite
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {rooms.map((room) => {
          const ed = editData[room.id] || { name: room.name, price: room.price, capacity: room.capacity }
          return (
            <div key={room.id} style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,43,60,0.4)', margin: 0 }}>
                  Suite #{room.id}
                </p>
                <button
                  onClick={() => toggleAvailability(room.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 12,
                    color: availability[room.id] ? '#16a34a' : '#ef4444',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: availability[room.id] ? '#16a34a' : '#ccc',
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
                        left: availability[room.id] ? 18 : 2,
                        transition: 'left 0.2s',
                      }}
                    />
                  </div>
                  {availability[room.id] ? 'Disponibile' : 'Non disponibile'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(26,43,60,0.4)', marginBottom: 4 }}>
                    Nome Suite
                  </label>
                  <input
                    type="text"
                    value={ed.name}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [room.id]: { ...ed, name: e.target.value } }))}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(26,43,60,0.4)', marginBottom: 4 }}>
                    Prezzo / notte (&euro;)
                  </label>
                  <input
                    type="number"
                    value={ed.price}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [room.id]: { ...ed, price: Number(e.target.value) } }))}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(26,43,60,0.4)', marginBottom: 4 }}>
                    Ospiti max
                  </label>
                  <input
                    type="number"
                    value={ed.capacity}
                    onChange={(e) => setEditData((prev) => ({ ...prev, [room.id]: { ...ed, capacity: Number(e.target.value) } }))}
                    style={inputStyle}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
                  />
                </div>
              </div>

              {/* Photo upload */}
              <div
                onClick={() => fileInputRefs.current[room.id]?.click()}
                style={{
                  border: '2px dashed #C4935A',
                  padding: 24,
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: 16,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(196,147,90,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.backgroundColor = 'rgba(196,147,90,0.1)' }}
                onDragLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                onDrop={(e) => {
                  e.preventDefault()
                  e.currentTarget.style.backgroundColor = 'transparent'
                  const file = e.dataTransfer.files[0]
                  if (file) handleFileUpload(room.slug, file)
                }}
              >
                <Upload size={24} strokeWidth={1.5} color="#C4935A" style={{ marginBottom: 8 }} />
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: 'rgba(26,43,60,0.5)', margin: 0 }}>
                  Trascina le foto qui o clicca per selezionare
                </p>
                <input
                  ref={(el) => { fileInputRefs.current[room.id] = el }}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(room.slug, file)
                    e.target.value = ''
                  }}
                />
              </div>

              {/* Existing images */}
              {room.images && room.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 16 }}>
                  {room.images.map((img, i) => (
                    <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', border: '1px solid rgba(26,43,60,0.08)' }}>
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => handleSave(room)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
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
                <Save size={16} strokeWidth={1.5} /> Salva Modifiche
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
