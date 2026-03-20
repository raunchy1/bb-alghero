'use client'

import { useEffect, useState } from 'react'
import { Check, X, RefreshCw, Calendar, CheckCircle, XCircle } from 'lucide-react'

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Jost', sans-serif",
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: 'rgba(26,43,60,0.4)',
  marginBottom: 4,
}

const sectionStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  border: '1px solid rgba(26,43,60,0.08)',
  padding: 24,
  marginBottom: 24,
}

export default function ImpostazioniPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [icalUrl, setIcalUrl] = useState('')
  const [icalStatus, setIcalStatus] = useState<{ ok: boolean | null; message: string } | null>(null)
  const [icalLoading, setIcalLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [language, setLanguage] = useState('IT')
  const [notificationEmail, setNotificationEmail] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    // Load general settings
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.metaTitle) setMetaTitle(data.metaTitle)
        if (data.metaDescription) setMetaDescription(data.metaDescription)
        if (data.language) setLanguage(data.language)
        if (data.notificationEmail) setNotificationEmail(data.notificationEmail)
        if (data.notificationsEnabled !== undefined) setNotificationsEnabled(data.notificationsEnabled)
      })
      .catch(console.error)

    // Load iCal config
    fetch('/api/admin/ical/config')
      .then((r) => r.json())
      .then((data) => {
        if (data.url) setIcalUrl(data.url)
        if (data.lastSync) setLastSync(new Date(data.lastSync).toLocaleString('it-IT'))
        if (data.bookedDates) setBookedDates(data.bookedDates)
      })
      .catch(console.error)
  }, [])

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const focusHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = '#C4935A'
  }
  const blurHandler = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'rgba(26,43,60,0.15)'
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showToast('Le password non coincidono', 'error')
      return
    }
    if (newPassword.length < 6) {
      showToast('La password deve avere almeno 6 caratteri', 'error')
      return
    }
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      if (res.ok) {
        showToast('Password aggiornata', 'success')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        showToast(data.error || 'Errore nel cambio password', 'error')
      }
    } catch {
      showToast('Errore di connessione', 'error')
    }
  }

  const handleTestIcal = async () => {
    setIcalLoading(true)
    setIcalStatus(null)
    try {
      const res = await fetch('/api/admin/ical/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: icalUrl }),
      })
      const data = await res.json()
      setIcalStatus({ ok: data.valid, message: data.message })
    } catch {
      setIcalStatus({ ok: false, message: 'Errore di connessione. Riprova.' })
    }
    setIcalLoading(false)
  }

  const handleSyncIcal = async () => {
    setIcalLoading(true)
    setIcalStatus(null)
    try {
      const res = await fetch('/api/admin/ical/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: icalUrl }),
      })
      const data = await res.json()
      if (data.success) {
        setIcalStatus({ ok: true, message: `Sincronizzazione riuscita! ${data.count} date importate.` })
        setLastSync(new Date().toLocaleString('it-IT'))
        setBookedDates(data.bookedDates || [])
      } else {
        setIcalStatus({ ok: false, message: data.error || 'Errore nella sincronizzazione.' })
      }
    } catch {
      setIcalStatus({ ok: false, message: 'Errore di connessione.' })
    }
    setIcalLoading(false)
  }

  const handleSaveSettings = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          icalUrl,
          metaTitle,
          metaDescription,
          language,
          notificationEmail,
          notificationsEnabled,
        }),
      })
      if (res.ok) showToast('Impostazioni salvate', 'success')
      else showToast('Errore nel salvataggio', 'error')
    } catch {
      showToast('Errore di connessione', 'error')
    }
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
        Impostazioni
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

      {/* Section 1: Change Password */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          Cambia Password
        </h2>
        <div style={{ display: 'grid', gap: 16, maxWidth: 400 }}>
          <div>
            <label style={labelStyle}>Password Attuale</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>
          <div>
            <label style={labelStyle}>Nuova Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>
          <div>
            <label style={labelStyle}>Conferma Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>
          <button
            onClick={handleChangePassword}
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
              width: 'fit-content',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#b38249' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#C4935A' }}
          >
            Aggiorna Password
          </button>
        </div>
      </div>

      {/* Section 2: Airbnb iCal Sync */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          Sincronizzazione Calendario Airbnb
        </h2>

        {/* How-to guide */}
        <div style={{
          background: 'rgba(196,147,90,0.06)',
          border: '1px solid rgba(196,147,90,0.3)',
          borderLeft: '3px solid #C4935A',
          borderRadius: 4, padding: '20px 24px',
          marginBottom: 24,
        }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A2B3C', marginBottom: 12, marginTop: 0 }}>
            Come ottenere il link iCal da Airbnb:
          </p>
          <ol style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#555', lineHeight: 2, paddingLeft: 20, margin: 0 }}>
            <li>Vai su <strong>airbnb.com</strong> e accedi al tuo account</li>
            <li>Clicca su <strong>Annunci</strong> → seleziona il tuo annuncio</li>
            <li>Vai su <strong>Disponibilità</strong></li>
            <li>Clicca su <strong>Strumenti di disponibilità</strong></li>
            <li>Clicca su <strong>Esporta calendario</strong></li>
            <li>Copia il link (inizia con https://www.airbnb.com/calendar/ical/...)</li>
            <li>Incollalo qui sotto e clicca <strong>Salva e Sincronizza</strong></li>
          </ol>
        </div>

        {/* URL input */}
        <div style={{ marginBottom: 20, maxWidth: 600 }}>
          <label style={labelStyle}>Link iCal Airbnb</label>
          <input
            type="url"
            value={icalUrl}
            onChange={(e) => setIcalUrl(e.target.value)}
            placeholder="https://www.airbnb.com/calendar/ical/XXXXXXXX.ics"
            style={inputStyle}
            onFocus={focusHandler}
            onBlur={blurHandler}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button
            onClick={handleTestIcal}
            disabled={!icalUrl || icalLoading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 24px',
              border: '1px solid rgba(26,43,60,0.2)',
              background: 'transparent', color: '#1A2B3C',
              fontFamily: "'Jost', sans-serif", fontSize: 13,
              cursor: icalUrl && !icalLoading ? 'pointer' : 'not-allowed',
              borderRadius: 2, opacity: !icalUrl || icalLoading ? 0.5 : 1,
            }}
          >
            <RefreshCw size={15} strokeWidth={1.5} />
            Testa Connessione
          </button>

          <button
            onClick={handleSyncIcal}
            disabled={!icalUrl || icalLoading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 32px',
              background: '#C4935A', color: 'white',
              border: 'none', fontFamily: "'Jost', sans-serif",
              fontSize: 13, letterSpacing: '0.05em',
              cursor: icalUrl && !icalLoading ? 'pointer' : 'not-allowed',
              borderRadius: 2, opacity: !icalUrl || icalLoading ? 0.5 : 1,
            }}
          >
            <Calendar size={15} strokeWidth={1.5} />
            {icalLoading ? 'Sincronizzazione...' : 'Salva e Sincronizza'}
          </button>
        </div>

        {/* Status message */}
        {icalStatus && (
          <div style={{
            padding: '14px 18px', borderRadius: 4, marginBottom: 20,
            background: icalStatus.ok === true ? 'rgba(34,197,94,0.08)' : icalStatus.ok === false ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)',
            border: `1px solid ${icalStatus.ok === true ? 'rgba(34,197,94,0.3)' : icalStatus.ok === false ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            {icalStatus.ok === true && <CheckCircle size={18} color="#22c55e" />}
            {icalStatus.ok === false && <XCircle size={18} color="#ef4444" />}
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14 }}>{icalStatus.message}</span>
          </div>
        )}

        {/* Last sync */}
        {lastSync && (
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#888', marginBottom: 20, marginTop: 0 }}>
            Ultima sincronizzazione: {lastSync}
          </p>
        )}

        {/* Booked dates preview */}
        {bookedDates.length > 0 && (
          <div style={{ background: '#FAF8F4', border: '1px solid rgba(26,43,60,0.08)', borderRadius: 4, padding: 24 }}>
            <h3 style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, fontWeight: 600, color: '#1A2B3C', marginTop: 0, marginBottom: 16 }}>
              Date prenotate da Airbnb
              <span style={{ color: '#C4935A', marginLeft: 8 }}>({bookedDates.length} date)</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {bookedDates.slice(0, 30).map(date => (
                <span key={date} style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#dc2626', padding: '4px 10px', borderRadius: 40,
                  fontFamily: "'Jost', sans-serif", fontSize: 12,
                }}>
                  {new Date(date + 'T00:00:00').toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                </span>
              ))}
              {bookedDates.length > 30 && (
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: '#888', padding: '4px 0' }}>
                  +{bookedDates.length - 30} altre date
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Section 3: SEO */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          SEO
        </h2>
        <div style={{ display: 'grid', gap: 16, maxWidth: 600 }}>
          <div>
            <label style={labelStyle}>Meta Title</label>
            <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} style={inputStyle} onFocus={focusHandler} onBlur={blurHandler} />
          </div>
          <div>
            <label style={labelStyle}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' as const }}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Language */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          Lingua Predefinita
        </h2>
        <div style={{ display: 'flex', gap: 0 }}>
          {['IT', 'EN'].map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: '10px 24px',
                border: '1px solid rgba(26,43,60,0.15)',
                backgroundColor: language === lang ? '#C4935A' : '#fff',
                color: language === lang ? '#fff' : '#1A2B3C',
                fontFamily: "'Jost', sans-serif",
                fontSize: 13,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Section 5: Notification Email */}
      <div style={sectionStyle}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#1A2B3C', margin: '0 0 20px 0' }}>
          Notifiche Prenotazioni
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              backgroundColor: notificationsEnabled ? '#16a34a' : '#ccc',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background-color 0.2s',
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                backgroundColor: '#fff',
                position: 'absolute',
                top: 2,
                left: notificationsEnabled ? 18 : 2,
                transition: 'left 0.2s',
              }}
            />
          </button>
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: '#1A2B3C' }}>
            {notificationsEnabled ? 'Notifiche attive' : 'Notifiche disattivate'}
          </span>
        </div>
        {notificationsEnabled && (
          <div style={{ maxWidth: 400 }}>
            <label style={labelStyle}>Email per notifiche</label>
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="admin@lasuiten4.it"
              style={inputStyle}
              onFocus={focusHandler}
              onBlur={blurHandler}
            />
          </div>
        )}
      </div>

      {/* Save All */}
      <button
        onClick={handleSaveSettings}
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
        Salva Impostazioni
      </button>
    </div>
  )
}
