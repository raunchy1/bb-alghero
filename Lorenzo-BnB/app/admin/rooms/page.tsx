'use client'

import { useEffect, useState } from 'react'

interface Room {
  id: number
  slug: string
  name: string
  price: number
  capacity: number
}

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{ id: number; type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    fetch('/api/rooms')
      .then((r) => r.json())
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const updateField = (id: number, field: keyof Room, value: string | number) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    )
  }

  const saveRoom = async (room: Room) => {
    setSaving(room.id)
    setFeedback(null)

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: room.id,
          name: room.name,
          price: Number(room.price),
          capacity: Number(room.capacity),
        }),
      })

      if (res.ok) {
        setFeedback({ id: room.id, type: 'success', msg: 'Salvato' })
      } else {
        setFeedback({ id: room.id, type: 'error', msg: 'Errore nel salvataggio' })
      }
    } catch {
      setFeedback({ id: room.id, type: 'error', msg: 'Errore di connessione' })
    } finally {
      setSaving(null)
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  if (loading) {
    return <div className="text-grey text-sm">Caricamento...</div>
  }

  return (
    <div>
      <h1 className="text-display-sm text-dark mb-1">Camere</h1>
      <p className="text-grey text-sm mb-8">Gestisci le camere e i prezzi</p>

      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-dark mb-1.5">Nome camera</label>
                <input
                  type="text"
                  value={room.name}
                  onChange={(e) => updateField(room.id, 'name', e.target.value)}
                  className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-dark mb-1.5">Prezzo/notte (€)</label>
                <input
                  type="number"
                  value={room.price}
                  onChange={(e) => updateField(room.id, 'price', e.target.value)}
                  className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-dark mb-1.5">Max ospiti</label>
                <input
                  type="number"
                  value={room.capacity}
                  onChange={(e) => updateField(room.id, 'capacity', e.target.value)}
                  className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => saveRoom(room)}
                  disabled={saving === room.id}
                  className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {saving === room.id ? 'Salvataggio...' : 'Salva'}
                </button>
                {feedback?.id === room.id && (
                  <span className={`text-xs font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-error'}`}>
                    {feedback.msg}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {rooms.length === 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center text-grey text-sm">
            Nessuna camera trovata
          </div>
        )}
      </div>
    </div>
  )
}
