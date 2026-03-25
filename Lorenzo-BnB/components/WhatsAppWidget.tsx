'use client'

import { useState } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+393478327243'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message || 'Ciao, vorrei informazioni su La Suite N°4')}`
  
  const quickReplies = [
    'Disponibilità camera?',
    'Prezzi?',
    'Dove si trova?',
    'Parcheggio?',
  ]
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: '#25D366',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'transform 0.2s',
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 88,
            right: 24,
            width: 320,
            backgroundColor: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            zIndex: 998,
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#25D366',
              color: '#fff',
              padding: '16px 20px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>La Suite N°4</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: 13, opacity: 0.9 }}>Rispondiamo entro pochi minuti</p>
          </div>
          
          {/* Quick Replies */}
          <div style={{ padding: 16 }}>
            <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#666' }}>
              Domande frequenti:
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => setMessage(reply)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: '#f0f0f0',
                    border: 'none',
                    borderRadius: 16,
                    fontSize: 12,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
          
          {/* Message Input */}
          <div style={{ padding: '0 16px 16px' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Scrivi il tuo messaggio..."
              style={{
                width: '100%',
                padding: 12,
                border: '1px solid #ddd',
                borderRadius: 8,
                fontSize: 14,
                resize: 'none',
                minHeight: 80,
                fontFamily: 'inherit',
              }}
            />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 12,
                padding: 12,
                backgroundColor: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              <Send size={18} />
              Invia su WhatsApp
            </a>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
