'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Calendar, Euro } from 'lucide-react'

interface PriceRule {
  id: number
  roomId: number
  room: { name: string }
  name: string
  startDate: string
  endDate: string
  price: number
  minNights: number
  isActive: boolean
}

interface Room {
  id: number
  name: string
}

export default function PriceRulesPage() {
  const [rules, setRules] = useState<PriceRule[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    roomId: '',
    name: '',
    startDate: '',
    endDate: '',
    price: '',
    minNights: '1',
  })
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    const [rulesRes, roomsRes] = await Promise.all([
      fetch('/api/admin/price-rules'),
      fetch('/api/rooms'),
    ])
    
    if (rulesRes.ok) setRules(await rulesRes.json())
    if (roomsRes.ok) {
      const roomsData = await roomsRes.json()
      setRooms(Array.isArray(roomsData) ? roomsData : [])
    }
    setLoading(false)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch('/api/admin/price-rules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    
    if (res.ok) {
      setShowForm(false)
      setFormData({ roomId: '', name: '', startDate: '', endDate: '', price: '', minNights: '1' })
      fetchData()
    }
  }
  
  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questa regola?')) return
    
    await fetch('/api/admin/price-rules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }
  
  if (loading) return <div>Caricamento...</div>
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 32, margin: 0 }}>
          Regole Prezzi
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            backgroundColor: '#C4935A',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          <Plus size={18} />
          Nuova Regola
        </button>
      </div>
      
      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, marginBottom: 24, borderRadius: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            <div>
              <label>Camera</label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                required
                style={{ width: '100%', padding: 10 }}
              >
                <option value="">Seleziona...</option>
                {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div>
              <label>Nome Regola</label>
              <input
                type="text"
                placeholder="es. Alta Stagione 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: '100%', padding: 10 }}
              />
            </div>
            <div>
              <label>Prezzo (€)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                style={{ width: '100%', padding: 10 }}
              />
            </div>
            <div>
              <label>Data Inizio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
                style={{ width: '100%', padding: 10 }}
              />
            </div>
            <div>
              <label>Data Fine</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
                style={{ width: '100%', padding: 10 }}
              />
            </div>
            <div>
              <label>Min. Notti</label>
              <input
                type="number"
                value={formData.minNights}
                onChange={(e) => setFormData({ ...formData, minNights: e.target.value })}
                min={1}
                style={{ width: '100%', padding: 10 }}
              />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <button type="submit" style={{ padding: '10px 24px', backgroundColor: '#C4935A', color: '#fff', border: 'none', borderRadius: 4 }}>
              Salva Regola
            </button>
          </div>
        </form>
      )}
      
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Camera</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Regola</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Periodo</th>
              <th style={{ padding: 12, textAlign: 'right' }}>Prezzo</th>
              <th style={{ padding: 12, textAlign: 'center' }}>Min. Notti</th>
              <th style={{ padding: 12, textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{rule.room.name}</td>
                <td style={{ padding: 12 }}>{rule.name || '-'}</td>
                <td style={{ padding: 12 }}>
                  {new Date(rule.startDate).toLocaleDateString('it-IT')} - {new Date(rule.endDate).toLocaleDateString('it-IT')}
                </td>
                <td style={{ padding: 12, textAlign: 'right' }}>€{rule.price}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>{rule.minNights}</td>
                <td style={{ padding: 12, textAlign: 'center' }}>
                  <button onClick={() => handleDelete(rule.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
