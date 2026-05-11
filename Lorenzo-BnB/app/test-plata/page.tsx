'use client'

import { useState } from 'react'
import { CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function TestPaymentPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleTestPayment = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const res = await fetch('/api/checkout/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestEmail: email || 'test@example.com',
          guestName: name || 'Utente Test'
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || data.details || 'Errore nella creazione del checkout')
      }

      if (data.url) {
        setSuccess(true)
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        throw new Error('URL checkout non disponibile')
      }

    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory pt-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold rounded-none mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif italic text-navy mb-2">
            Test Pagamento Stripe
          </h1>
          <p className="text-gray-600">
            Testa l&apos;integrazione Stripe con un pagamento di 1 EUR
          </p>
        </div>

        {/* Test Mode Badge */}
        <div className="bg-purple-100 border border-purple-300 rounded-none p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧪</span>
            <span className="font-semibold text-purple-800">MODALITÀ TEST</span>
          </div>
          <p className="text-sm text-purple-700">
            Questa è una pagina di test. Puoi utilizzare la carta di test Stripe:
          </p>
          <code className="block mt-2 bg-purple-200 px-3 py-2 rounded text-purple-900 font-mono text-sm">
            4242 4242 4242 4242
          </code>
          <div className="mt-2 text-sm text-purple-700">
            <p>📅 Data scadenza: qualsiasi data futura</p>
            <p>🔒 CVC: qualsiasi 3 cifre</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-none  p-6">
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-none flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-none flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">
                Reindirizzamento a Stripe Checkout...
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opzionale)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome (opzionale)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mario Rossi"
                className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-gold focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              onClick={handleTestPayment}
              disabled={loading}
              className="w-full py-4 bg-navy text-white rounded-none font-medium text-lg hover:bg-navy/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Elaborazione...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Paga 1 EUR (Test)
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Il pagamento è elaborato in modalità test Stripe. <br />
              Non verrà addebitata alcuna somma reale.
            </p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-none p-4 ">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Importo</p>
            <p className="text-2xl font-bold text-navy">1.00 EUR</p>
          </div>
          <div className="bg-white rounded-none p-4 ">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Stato</p>
            <p className="text-sm font-medium text-purple-600">🧪 Modalità Test</p>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="text-sm text-gray-600 hover:text-gold transition-colors"
          >
            ← Torna al sito
          </a>
        </div>

      </div>
    </div>
  )
}
