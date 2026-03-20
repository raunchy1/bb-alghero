'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, X, Check } from 'lucide-react'

interface Photo {
  path: string
  category: string
  name: string
}

const categories = [
  { key: 'all', label: 'Tutte' },
  { key: 'rooms', label: 'Camere' },
  { key: 'terrace', label: 'Terrazza' },
  { key: 'bathroom', label: 'Bagno' },
  { key: 'common', label: 'Comune' },
  { key: 'altro', label: 'Altro' },
]

const uploadCategories = ['rooms', 'terrace', 'balcony', 'bathroom', 'common']

export default function GalleriaPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [uploadCat, setUploadCat] = useState('common')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = () => {
    fetch('/api/admin/gallery')
      .then((r) => r.json())
      .then((data) => setPhotos(data.photos || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPhotos() }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', uploadCat)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      if (res.ok) {
        showToast('Foto caricata', 'success')
        fetchPhotos()
      } else {
        showToast('Errore nel caricamento', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleDelete = async (filepath: string) => {
    if (!confirm('Eliminare questa foto?')) return
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filepath }),
      })
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.path !== filepath))
        showToast('Foto eliminata', 'success')
      } else {
        showToast('Errore nella cancellazione', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const filtered = filter === 'all' ? photos : photos.filter((p) => p.category === filter)

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
        Gestione Galleria
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

      {/* Upload section */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <label style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,43,60,0.4)' }}>
            Categoria:
          </label>
          <select
            value={uploadCat}
            onChange={(e) => setUploadCat(e.target.value)}
            style={{
              border: '1px solid rgba(26,43,60,0.15)',
              borderRadius: 4,
              padding: '8px 12px',
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              outline: 'none',
            }}
          >
            {uploadCategories.map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </div>

        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed #C4935A',
            padding: 40,
            textAlign: 'center',
            cursor: 'pointer',
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
            if (file) handleUpload(file)
          }}
        >
          <Upload size={32} strokeWidth={1.5} color="#C4935A" style={{ marginBottom: 12 }} />
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.5)', margin: 0 }}>
            Trascina le foto qui o clicca per selezionare
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
              e.target.value = ''
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilter(cat.key)}
            style={{
              padding: '8px 16px',
              border: `1px solid ${filter === cat.key ? '#C4935A' : 'rgba(26,43,60,0.2)'}`,
              borderRadius: 20,
              backgroundColor: filter === cat.key ? '#C4935A' : 'transparent',
              color: filter === cat.key ? '#fff' : '#1A2B3C',
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Photo grid */}
      {loading ? (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.5)' }}>Caricamento...</p>
      ) : filtered.length === 0 ? (
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(26,43,60,0.5)' }}>Nessuna foto in questa categoria</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {filtered.map((photo) => (
            <div
              key={photo.path}
              style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)' }}
              className="group"
            >
              <img src={photo.path} alt={photo.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {/* Category badge */}
              <span
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  padding: '3px 10px',
                  border: '1px solid #C4935A',
                  borderRadius: 12,
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10,
                  color: '#C4935A',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {photo.category}
              </span>
              {/* Delete button */}
              <button
                onClick={() => handleDelete(photo.path)}
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239,68,68,0.9)',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0.7,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
