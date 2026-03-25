'use client'

import { useEffect, useState } from 'react'
import { Check, Clock, User, Calendar } from 'lucide-react'

interface CleaningTask {
  id: number
  room: { name: string }
  date: string
  status: 'pending' | 'in_progress' | 'done' | 'cancelled'
  assignedTo: string | null
  notes: string | null
  completedAt: string | null
}

export default function CleaningPage() {
  const [tasks, setTasks] = useState<CleaningTask[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')
  
  useEffect(() => {
    fetchTasks()
  }, [])
  
  const fetchTasks = async () => {
    const res = await fetch('/api/admin/cleaning')
    if (res.ok) {
      setTasks(await res.json())
    }
    setLoading(false)
  }
  
  const updateStatus = async (id: number, status: string) => {
    await fetch('/api/admin/cleaning', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    fetchTasks()
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return '#22c55e'
      case 'in_progress': return '#3b82f6'
      case 'pending': return '#f59e0b'
      default: return '#9ca3af'
    }
  }
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'done': return 'Completata'
      case 'in_progress': return 'In corso'
      case 'pending': return 'Da fare'
      default: return status
    }
  }
  
  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter)
  
  if (loading) return <div>Caricamento...</div>
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 32, margin: 0 }}>
          Gestione Pulizie
        </h1>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['all', 'pending', 'done'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                backgroundColor: filter === f ? '#C4935A' : '#f5f5f5',
                color: filter === f ? '#fff' : '#333',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f === 'all' ? 'Tutte' : f === 'pending' ? 'Da fare' : 'Completate'}
            </button>
          ))}
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 8,
              borderLeft: `4px solid ${getStatusColor(task.status)}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{task.room.name}</h3>
              <span
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  backgroundColor: getStatusColor(task.status) + '20',
                  color: getStatusColor(task.status),
                }}
              >
                {getStatusLabel(task.status)}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#666', fontSize: 14 }}>
              <Calendar size={16} />
              {new Date(task.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' })}
            </div>
            
            {task.assignedTo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#666', fontSize: 14 }}>
                <User size={16} />
                {task.assignedTo}
              </div>
            )}
            
            {task.notes && (
              <p style={{ fontSize: 13, color: '#888', margin: '8px 0' }}>{task.notes}</p>
            )}
            
            {task.status !== 'done' && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {task.status === 'pending' && (
                  <button
                    onClick={() => updateStatus(task.id, 'in_progress')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Inizia
                  </button>
                )}
                <button
                  onClick={() => updateStatus(task.id, 'done')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    backgroundColor: '#22c55e',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  Completata
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
