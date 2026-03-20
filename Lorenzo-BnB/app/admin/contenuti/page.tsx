'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid rgba(26,43,60,0.15)',
  borderRadius: 4,
  padding: '10px 14px',
  fontFamily: "'Jost', sans-serif",
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 100,
  resize: 'vertical' as const,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'rgba(26,43,60,0.4)',
  marginBottom: 4,
}

const tabs = [
  { key: 'homepage', label: 'Homepage' },
  { key: 'contatti', label: 'Contatti' },
  { key: 'partner', label: 'Partner' },
]

interface ContentData {
  homepage: { heroTitle: string; heroSubtitle: string; aboutDescription: string }
  contact: { phone: string; whatsapp: string; email: string; address: string; checkinTime: string; checkoutTime: string }
  partner: { name: string; description: string; instagram: string; discountText: string }
}

export default function ContenutiPage() {
  const [activeTab, setActiveTab] = useState('homepage')
  const [data, setData] = useState<ContentData>({
    homepage: { heroTitle: '', heroSubtitle: '', aboutDescription: '' },
    contact: { phone: '', whatsapp: '', email: '', address: '', checkinTime: '15:00', checkoutTime: '11:00' },
    partner: { name: '', description: '', instagram: '', discountText: '' },
  })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    fetch('/api/admin/content')
      .then((r) => r.json())
      .then((d) => setData((prev) => ({ ...prev, ...d })))
      .catch(console.error)
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) showToast('Contenuti salvati con successo', 'success')
      else showToast('Errore nel salvataggio', 'error')
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#C4935A'
  }
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)'
  }

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
        Contenuti
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(26,43,60,0.1)' }}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '12px 24px',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #C4935A' : '2px solid transparent',
              backgroundColor: 'transparent',
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: activeTab === tab.key ? '#C4935A' : 'rgba(26,43,60,0.5)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24, marginBottom: 24 }}>
        {activeTab === 'homepage' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={labelStyle}>Titolo Hero</label>
              <input
                type="text"
                value={data.homepage.heroTitle}
                onChange={(e) => setData({ ...data, homepage: { ...data.homepage, heroTitle: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Sottotitolo Hero</label>
              <input
                type="text"
                value={data.homepage.heroSubtitle}
                onChange={(e) => setData({ ...data, homepage: { ...data.homepage, heroSubtitle: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Descrizione About</label>
              <textarea
                value={data.homepage.aboutDescription}
                onChange={(e) => setData({ ...data, homepage: { ...data.homepage, aboutDescription: e.target.value } })}
                style={textareaStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          </div>
        )}

        {activeTab === 'contatti' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={labelStyle}>Telefono</label>
              <input
                type="text"
                value={data.contact.phone}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>WhatsApp</label>
              <input
                type="text"
                value={data.contact.whatsapp}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={data.contact.email}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Indirizzo</label>
              <input
                type="text"
                value={data.contact.address}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Orario Check-in</label>
              <input
                type="time"
                value={data.contact.checkinTime}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, checkinTime: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Orario Check-out</label>
              <input
                type="time"
                value={data.contact.checkoutTime}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, checkoutTime: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          </div>
        )}

        {activeTab === 'partner' && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={labelStyle}>Nome Ristorante</label>
              <input
                type="text"
                value={data.partner.name}
                onChange={(e) => setData({ ...data, partner: { ...data.partner, name: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Descrizione</label>
              <textarea
                value={data.partner.description}
                onChange={(e) => setData({ ...data, partner: { ...data.partner, description: e.target.value } })}
                style={textareaStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Instagram Handle</label>
              <input
                type="text"
                value={data.partner.instagram}
                onChange={(e) => setData({ ...data, partner: { ...data.partner, instagram: e.target.value } })}
                style={inputStyle}
                placeholder="@sea_star_alghero"
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
            <div>
              <label style={labelStyle}>Testo Sconto</label>
              <input
                type="text"
                value={data.partner.discountText}
                onChange={(e) => setData({ ...data, partner: { ...data.partner, discountText: e.target.value } })}
                style={inputStyle}
                onFocus={focusHandler}
                onBlur={blurHandler}
              />
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#C4935A',
          color: '#fff',
          border: 'none',
          borderRadius: 2,
          padding: '12px 24px',
          fontFamily: "'Jost', sans-serif",
          fontSize: 13,
          letterSpacing: '0.05em',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b38249' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C4935A' }}
      >
        Salva Contenuti
      </button>
    </div>
  )
}
