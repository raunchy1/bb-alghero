'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-display-sm text-dark">Admin</h1>
          <p className="text-grey text-sm mt-2">Il B&B di Lorenzo — Pannello di gestione</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lasuiten4.it"
                required
                className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-error text-xs font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            >
              {loading ? 'Accesso...' : 'Accedi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
