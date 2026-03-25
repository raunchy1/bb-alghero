'use client'

import { useState } from 'react'
import { Mail, Check, AlertCircle } from 'lucide-react'

export default function NewsletterForm({ source = 'website' }: { source?: string }) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source }),
      })
      
      const data = await res.json()
      
      if (data.success) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Errore durante l\'iscrizione')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Errore di connessione')
    }
  }
  
  return (
    <div style={{ backgroundColor: '#1A2B3C', padding: '40px 32px', borderRadius: 8 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Mail size={32} color="#C4935A" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ color: '#fff', margin: '0 0 8px 0', fontSize: 20 }}>
          Resta aggiornato
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: 14 }}>
          Iscriviti per ricevere offerte speciali e novità
        </p>
      </div>
      
      {status === 'success' ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Check size={48} color="#22c55e" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#fff', margin: 0 }}>{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Il tuo nome (opzionale)"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 14,
              }}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="La tua email *"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: 14,
              }}
            />
          </div>
          
          {status === 'error' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 8, 
              marginBottom: 12,
              color: '#ef4444',
              fontSize: 13,
            }}>
              <AlertCircle size={16} />
              {message}
            </div>
          )}
          
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#C4935A',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              fontSize: 14,
              fontWeight: 500,
              cursor: status === 'loading' ? 'not-allowed' : 'pointer',
              opacity: status === 'loading' ? 0.7 : 1,
            }}
          >
            {status === 'loading' ? 'Iscrizione in corso...' : 'Iscriviti alla Newsletter'}
          </button>
          
          <p style={{ 
            color: 'rgba(255,255,255,0.5)', 
            fontSize: 11, 
            textAlign: 'center',
            marginTop: 12,
          }}>
            Rispettiamo la tua privacy. Puoi disiscriverti in qualsiasi momento.
          </p>
        </form>
      )}
    </div>
  )
}
