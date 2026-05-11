'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

function TestSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const isTest = searchParams.get('test') === 'true'
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setMessage('Session ID mancante')
      return
    }

    // Verify the payment status
    async function verifyPayment() {
      try {
        // In a real app, you&apos;d verify with your backend
        // For now, we just show success since Stripe redirected here
        setStatus('success')
        setMessage('Pagamento di test completato con successo!')
      } catch (error) {
        setStatus('error')
        setMessage('Errore nella verifica del pagamento')
      }
    }

    verifyPayment()
  }, [sessionId])

  return (
    <div className="min-h-screen bg-ivory pt-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-none  p-8 text-center">
        
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-serif italic text-navy mb-2">
              Verifica pagamento...
            </h1>
            <p className="text-gray-600">Attendi un momento</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-none text-sm font-medium mb-4">
              <span>🧪 MODALITÀ TEST</span>
            </div>
            <h1 className="text-2xl font-serif italic text-navy mb-2">
              Pagamento Riuscito!
            </h1>
            <p className="text-gray-600 mb-2">{message}</p>
            <p className="text-sm text-gray-500 mb-6">
              Session ID: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{sessionId?.slice(0, 20)}...</code>
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-none p-4 mb-6 text-left">
              <p className="text-sm text-green-800">
                <strong>✅ Test completato con successo!</strong><br />
                Stripe Checkout funziona correttamente. In modalità produzione, 
                verrebbe inviata un&apos;email di conferma e aggiornato lo stato della prenotazione.
              </p>
            </div>

            <div className="space-y-3">
              <Link 
                href="/"
                className="block w-full py-4 bg-navy text-white rounded-none font-medium hover:bg-navy/80 transition-colors"
              >
                Torna al sito
              </Link>
              <Link 
                href="/admin/bookings"
                className="block w-full py-4 border border-[#1A2B3C] text-navy rounded-none font-medium hover:bg-gray-50 transition-colors"
              >
                Vedi prenotazioni in Admin
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-serif italic text-navy mb-2">
              Errore
            </h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link 
              href="/"
              className="block w-full py-4 bg-navy text-white rounded-none font-medium"
            >
              Torna al sito
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function TestSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory pt-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-gold animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    }>
      <TestSuccessContent />
    </Suspense>
  )
}
