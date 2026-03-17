'use client'

import { useEffect, useState } from 'react'

interface SettingsData {
  propertyName: string
  stripePublicKey: string
  stripeSecretKey: string
  whatsappNumber: string
  adminEmail: string
  adminPassword: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    propertyName: '',
    stripePublicKey: '',
    stripeSecretKey: '',
    whatsappNumber: '',
    adminEmail: '',
    adminPassword: '',
  })
  const [hasStripeSecret, setHasStripeSecret] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    fetch('/api/admin/settings', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          propertyName: data.propertyName || '',
          stripePublicKey: data.stripePublicKey || '',
          stripeSecretKey: '',
          whatsappNumber: data.whatsappNumber || '',
          adminEmail: data.adminEmail || '',
          adminPassword: '',
        })
        setHasStripeSecret(data.hasStripeSecret || false)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setFeedback({ type: 'success', msg: 'Impostazioni salvate con successo' })
        if (settings.stripeSecretKey) setHasStripeSecret(true)
        setSettings((prev) => ({ ...prev, adminPassword: '', stripeSecretKey: '' }))
      } else {
        const data = await res.json()
        setFeedback({ type: 'error', msg: data.error || 'Errore nel salvataggio' })
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Errore di connessione' })
    } finally {
      setSaving(false)
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  if (loading) {
    return <div className="text-grey text-sm">Caricamento...</div>
  }

  return (
    <div>
      <h1 className="text-display-sm text-dark mb-1">Impostazioni</h1>
      <p className="text-grey text-sm mb-8">Configurazione della struttura</p>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        {/* Property */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-dark">Struttura</h2>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Nome struttura</label>
            <input
              type="text"
              value={settings.propertyName}
              onChange={(e) => setSettings({ ...settings, propertyName: e.target.value })}
              className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Numero WhatsApp</label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              placeholder="+39..."
              className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Stripe */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-dark">Pagamenti — Stripe</h2>
          <p className="text-xs text-grey">Inserisci le chiavi Stripe per attivare i pagamenti online</p>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Stripe Publishable Key</label>
            <input
              type="text"
              value={settings.stripePublicKey}
              onChange={(e) => setSettings({ ...settings, stripePublicKey: e.target.value })}
              placeholder="pk_live_..."
              className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Stripe Secret Key</label>
            <input
              type="password"
              value={settings.stripeSecretKey}
              onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
              placeholder={hasStripeSecret ? '••••••' : 'sk_live_...'}
              className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors font-mono"
            />
          </div>
        </div>

        {/* Admin credentials */}
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-dark">Accesso Admin</h2>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1.5">Nuova Password</label>
            <input
              type="password"
              value={settings.adminPassword}
              onChange={(e) => setSettings({ ...settings, adminPassword: e.target.value })}
              placeholder="Lascia vuoto per non modificare"
              className="w-full bg-white border border-light-grey rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva impostazioni'}
          </button>
          {feedback && (
            <span className={`text-sm font-medium ${feedback.type === 'success' ? 'text-green-600' : 'text-error'}`}>
              {feedback.msg}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
