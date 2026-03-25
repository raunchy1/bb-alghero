'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])
  
  const acceptAll = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }))
    setIsVisible(false)
  }
  
  const acceptNecessary = () => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }))
    setIsVisible(false)
  }
  
  if (!isVisible) return null
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1A2B3C',
        color: '#fff',
        padding: '20px 24px',
        zIndex: 1000,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            <strong style={{ color: '#C4935A' }}>Utilizziamo i cookie</strong> per migliorare la tua esperienza. 
            I cookie necessari sono essenziali per il funzionamento del sito. 
            Con il tuo consenso, utilizziamo anche cookie per analisi e marketing.
          </p>
          <a 
            href="/privacy" 
            style={{ 
              color: '#C4935A', 
              fontSize: 13, 
              textDecoration: 'underline',
              marginTop: 8,
              display: 'inline-block',
            }}
          >
            Leggi la Privacy Policy
          </a>
        </div>
        
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <button
            onClick={acceptNecessary}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
              whiteSpace: 'nowrap',
            }}
          >
            Solo necessari
          </button>
          <button
            onClick={acceptAll}
            style={{
              padding: '10px 20px',
              backgroundColor: '#C4935A',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Accetta tutti
          </button>
        </div>
        
        <button
          onClick={acceptNecessary}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: 8,
            opacity: 0.6,
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  )
}
