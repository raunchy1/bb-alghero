'use client'

import { useEffect, useState } from 'react'
import { CreditCard, Check, X, AlertCircle, ExternalLink, TestTube, Play, Shield, Key } from 'lucide-react'

interface Settings {
  stripePublicKey: string
  stripeTestPublicKey: string
  stripeMode: string
  hasStripeSecret: boolean
  hasStripeTestSecret: boolean
  hasWebhookSecret: boolean
}

export default function StripeSetupPage() {
  const [settings, setSettings] = useState<Settings>({
    stripePublicKey: '',
    stripeTestPublicKey: '',
    stripeMode: 'test',
    hasStripeSecret: false,
    hasStripeTestSecret: false,
    hasWebhookSecret: false,
  })
  
  // Form states
  const [testPublicKey, setTestPublicKey] = useState('')
  const [testSecretKey, setTestSecretKey] = useState('')
  const [livePublicKey, setLivePublicKey] = useState('')
  const [liveSecretKey, setLiveSecretKey] = useState('')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [mode, setMode] = useState('test')
  
  // Test states
  const [testEmail, setTestEmail] = useState('')
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<{success?: boolean; message?: string; url?: string} | null>(null)
  
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings')
      const data = await res.json()
      setSettings(data)
      
      // Set form values
      setTestPublicKey(data.stripeTestPublicKey || '')
      setLivePublicKey(data.stripePublicKey || '')
      setMode(data.stripeMode || 'test')
      
      setLoading(false)
    } catch (error) {
      console.error('Error fetching settings:', error)
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveTestKeys = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          stripeTestPublicKey: testPublicKey,
          stripeTestSecretKey: testSecretKey,
        }),
      })
      if (res.ok) {
        showToast('Chiavi di test salvate con successo!', 'success')
        fetchSettings()
        setTestSecretKey('') // Clear secret after save
      } else {
        showToast('Errore nel salvataggio', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleSaveLiveKeys = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          stripePublicKey: livePublicKey,
          stripeSecretKey: liveSecretKey,
        }),
      })
      if (res.ok) {
        showToast('Chiavi live salvate con successo!', 'success')
        fetchSettings()
        setLiveSecretKey('') // Clear secret after save
      } else {
        showToast('Errore nel salvataggio', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleSaveMode = async (newMode: string) => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ stripeMode: newMode }),
      })
      if (res.ok) {
        setMode(newMode)
        showToast(`Modalità ${newMode.toUpperCase()} attivata`, 'success')
        fetchSettings()
      } else {
        showToast('Errore nel cambio modalità', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleSaveWebhook = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ stripeWebhookSecret: webhookSecret }),
      })
      if (res.ok) {
        showToast('Webhook secret salvato!', 'success')
        fetchSettings()
        setWebhookSecret('')
      } else {
        showToast('Errore nel salvataggio', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleTestPayment = async () => {
    setTestLoading(true)
    setTestResult(null)
    
    try {
      const res = await fetch('/api/checkout/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: testEmail || 'test@example.com',
          guestName: 'Utente Test'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Errore nel test')
      }

      if (data.url) {
        setTestResult({
          success: true,
          message: 'Checkout creato! Reindirizzamento in corso...',
          url: data.url
        })
        // Redirect after showing success
        setTimeout(() => {
          window.open(data.url, '_blank')
        }, 1500)
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message
      })
    } finally {
      setTestLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <CreditCard size={28} strokeWidth={1.5} color="#C4935A" />
        <h1 className="text-[28px] md:text-[32px]" style={{ fontFamily: "'Cormorant', serif", fontStyle: 'italic', color: 'oklch(22% 0.01 75)', fontWeight: 500, margin: 0 }}>
          Configurazione Stripe
        </h1>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 24, right: 24, padding: '12px 20px', backgroundColor: '#fff', border: `1px solid ${toast.type === 'success' ? '#16a34a' : '#ef4444'}`, color: toast.type === 'success' ? '#16a34a' : '#ef4444', fontFamily: "'Figtree', sans-serif", fontSize: 13, zIndex: 1000, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Status Banner */}
      <div className={`p-4 mb-6 rounded-none ${settings.stripeMode === 'live' ? 'bg-green-50 border border-green-200' : 'bg-purple-50 border border-purple-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${settings.stripeMode === 'live' ? 'bg-green-500' : 'bg-purple-500'}`} />
            <div>
              <p className="font-medium text-sm" style={{ color: settings.stripeMode === 'live' ? '#166534' : '#6b21a8' }}>
                Modalità {settings.stripeMode === 'live' ? 'LIVE' : 'TEST'} attiva
              </p>
              <p className="text-xs mt-0.5" style={{ color: settings.stripeMode === 'live' ? '#15803d' : '#7c3aed' }}>
                {settings.stripeMode === 'live' 
                  ? '⚠️ I pagamenti sono REALI - assicurati che le chiavi live siano configurate'
                  : '🧪 I pagamenti sono di test - nessun addebito reale'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleSaveMode('test')}
              className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${mode === 'test' ? 'bg-purple-600 text-white' : 'bg-border text-muted hover:bg-gray-300'}`}
            >
              🧪 Test
            </button>
            <button
              onClick={() => handleSaveMode('live')}
              className={`px-4 py-2 rounded-none text-sm font-medium transition-colors ${mode === 'live' ? 'bg-green-600 text-white' : 'bg-border text-muted hover:bg-gray-300'}`}
            >
              🚀 Live
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* TEST KEYS SECTION */}
        <div className="bg-white border border-border rounded-none p-6">
          <div className="flex items-center gap-2 mb-4">
            <TestTube size={20} className="text-purple-600" />
            <h2 className="text-xl font-medium" style={{ fontFamily: "'Cormorant', serif", color: 'oklch(22% 0.01 75)' }}>
              Chiavi di Test
            </h2>
            <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              {settings.hasStripeTestSecret ? '✅ Configurate' : '❌ Mancanti'}
            </span>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-none p-3 mb-4">
            <p className="text-sm text-purple-800">
              <strong>Per testare:</strong> Vai su{' '}
              <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noreferrer" className="underline">
                dashboard.stripe.com/test/apikeys
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Publishable Key (pk_test_...)</label>
              <input
                type="text"
                value={testPublicKey}
                onChange={(e) => setTestPublicKey(e.target.value)}
                placeholder="pk_test_xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-border rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Secret Key (sk_test_...)</label>
              <input
                type="password"
                value={testSecretKey}
                onChange={(e) => setTestSecretKey(e.target.value)}
                placeholder={settings.hasStripeTestSecret ? '••••••••••••••••' : 'sk_test_YOUR_TEST_KEY_HERE'}
                className="w-full px-3 py-2 border border-border rounded-none focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm font-mono"
              />
              {settings.hasStripeTestSecret && !testSecretKey && (
                <p className="text-xs text-muted mt-1">✅ Secret key già salvata. Compila solo per cambiarla.</p>
              )}
            </div>
            <button
              onClick={handleSaveTestKeys}
              className="w-full py-2.5 bg-purple-600 text-white rounded-none font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Key size={16} />
              Salva Chiavi Test
            </button>
          </div>
        </div>

        {/* LIVE KEYS SECTION */}
        <div className="bg-white border border-border rounded-none p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-green-600" />
            <h2 className="text-xl font-medium" style={{ fontFamily: "'Cormorant', serif", color: 'oklch(22% 0.01 75)' }}>
              Chiavi Live (Produzione)
            </h2>
            <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              {settings.hasStripeSecret ? '✅ Configurate' : '❌ Mancanti'}
            </span>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-none p-3 mb-4">
            <p className="text-sm text-green-800">
              <strong>Per produzione:</strong> Attiva prima il conto su{' '}
              <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="underline">
                dashboard.stripe.com/apikeys
              </a>
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Publishable Key (pk_live_...)</label>
              <input
                type="text"
                value={livePublicKey}
                onChange={(e) => setLivePublicKey(e.target.value)}
                placeholder="pk_live_xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-border rounded-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted mb-1">Secret Key (sk_live_...)</label>
              <input
                type="password"
                value={liveSecretKey}
                onChange={(e) => setLiveSecretKey(e.target.value)}
                placeholder={settings.hasStripeSecret ? '••••••••••••••••' : 'sk_live_YOUR_LIVE_KEY_HERE'}
                className="w-full px-3 py-2 border border-border rounded-none focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm font-mono"
              />
              {settings.hasStripeSecret && !liveSecretKey && (
                <p className="text-xs text-muted mt-1">✅ Secret key già salvata. Compila solo per cambiarla.</p>
              )}
            </div>
            <button
              onClick={handleSaveLiveKeys}
              className="w-full py-2.5 bg-green-600 text-white rounded-none font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              Salva Chiavi Live
            </button>
          </div>
        </div>
      </div>

      {/* TEST PAYMENT SECTION */}
      <div className="mt-6 bg-white border border-border rounded-none p-6">
        <div className="flex items-center gap-2 mb-4">
          <Play size={20} className="text-gold" />
          <h2 className="text-xl font-medium" style={{ fontFamily: "'Cormorant', serif", color: 'oklch(22% 0.01 75)' }}>
            Testa il Pagamento
          </h2>
        </div>

        {!settings.hasStripeTestSecret ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-none p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Per testare, prima configura le <strong>Chiavi di Test</strong> nella sezione sopra.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-sand border border-border rounded-none p-4 mb-4">
              <p className="text-sm text-muted mb-2">
                Clicca il pulsante qui sotto per creare un pagamento di test di <strong>1.00 EUR</strong>.
              </p>
              <p className="text-sm text-muted">
                <strong>Carta di test:</strong> <code className="bg-border px-2 py-0.5 rounded-none font-mono">4242 4242 4242 4242</code>
                <br />
                <strong>Data:</strong> qualsiasi data futura | <strong>CVC:</strong> qualsiasi 3 cifre
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Email per il test (opzionale)"
                className="flex-1 px-3 py-2 border border-border rounded-none focus:ring-2 focus:ring-gold focus:border-transparent outline-none text-sm"
              />
              <button
                onClick={handleTestPayment}
                disabled={testLoading}
                className="px-6 py-2 bg-navy text-white rounded-none font-medium hover:bg-navy/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {testLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creazione...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Testa Pagamento 1 EUR
                  </>
                )}
              </button>
            </div>

            {testResult && (
              <div className={`mt-4 p-4 rounded-none ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={`text-sm ${testResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {testResult.success ? '✅' : '❌'} {testResult.message}
                </p>
                {testResult.url && (
                  <a 
                    href={testResult.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-green-700 hover:underline"
                  >
                    Apri Stripe Checkout <ExternalLink size={14} />
                  </a>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* WEBHOOK SECTION */}
      <div className="mt-6 bg-white border border-border rounded-none p-6">
        <div className="flex items-center gap-2 mb-4">
          <Key size={20} className="text-muted" />
          <h2 className="text-xl font-medium" style={{ fontFamily: "'Cormorant', serif", color: 'oklch(22% 0.01 75)' }}>
            Webhook Secret (Opzionale)
          </h2>
          <span className="ml-auto px-2 py-1 bg-sand text-muted text-xs rounded-full">
            {settings.hasWebhookSecret ? '✅ Configurato' : 'Opzionale'}
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-none p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Avanzato:</strong> Il webhook permette al sistema di ricevere notifiche automatiche da Stripe quando un pagamento viene completato. 
            <a href="https://dashboard.stripe.com/webhooks" target="_blank" rel="noreferrer" className="underline ml-1">
              Configura su Stripe
            </a>
          </p>
        </div>

        <div className="flex gap-4">
          <input
            type="password"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            placeholder={settings.hasWebhookSecret ? '••••••••••••••••' : 'whsec_xxxxxxxxxxxxxxxxxxxxxxxx'}
            className="flex-1 px-3 py-2 border border-border rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm font-mono"
          />
          <button
            onClick={handleSaveWebhook}
            className="px-6 py-2 bg-gray-600 text-white rounded-none font-medium hover:bg-gray-700 transition-colors"
          >
            Salva
          </button>
        </div>
      </div>

      {/* INSTRUCTIONS */}
      <div className="mt-6 bg-[#FAF8F4] border border-gold/20 rounded-none p-6">
        <h3 className="text-lg font-medium text-navy mb-3" style={{ fontFamily: "'Cormorant', serif" }}>
          📖 Guida Rapida
        </h3>
        <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
          <li>Crea un account su <a href="https://stripe.com" target="_blank" rel="noreferrer" className="text-gold underline">stripe.com</a></li>
          <li>Vai in <strong>Developers → API Keys</strong></li>
          <li>Attiva <strong>Test Mode</strong> (switch in alto a destra)</li>
          <li>Copia <code className="bg-border px-1 rounded">pk_test_...</code> e <code className="bg-border px-1 rounded">sk_test_...</code> nelle <strong>Chiavi di Test</strong></li>
          <li>Clicca <strong>Testa Pagamento 1 EUR</strong> per verificare che funzioni</li>
          <li>Quando sei pronto per i pagamenti reali, attiva il conto e inserisci le chiavi <strong>Live</strong></li>
          <li>Cambia <strong>Modalità</strong> da Test a Live</li>
        </ol>
      </div>
    </div>
  )
}
