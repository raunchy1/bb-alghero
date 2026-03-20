'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(26,43,60,0.15)',
  borderRadius: 4,
  padding: '10px 14px',
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.2s',
  boxSizing: 'border-box' as const,
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Credenziali non valide')
        setLoading(false)
        return
      }

      localStorage.setItem('admin_token', data.token)
      router.push('/admin/dashboard')
    } catch {
      setError('Errore di connessione')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAF8F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: 'italic',
              fontSize: 28,
              color: '#1A2B3C',
              fontWeight: 500,
              margin: 0,
              marginBottom: 8,
            }}
          >
            La Suite N4
          </h1>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              color: '#C4935A',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              margin: 0,
            }}
          >
            Pannello di Gestione
          </p>
        </div>

        <div
          style={{
            backgroundColor: '#fff',
            padding: 32,
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  color: '#1A2B3C',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lasuiten4.it"
                required
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  color: '#1A2B3C',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#C4935A' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)' }}
              />
            </div>

            {error && (
              <p style={{ color: '#ef4444', fontFamily: "'Jost', sans-serif", fontSize: 13, margin: '0 0 16px 0' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: '#C4935A',
                color: '#fff',
                border: 'none',
                borderRadius: 2,
                padding: '12px 24px',
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#b38249' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C4935A' }}
            >
              {loading ? 'Accesso...' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
