'use client'

import { useEffect, useState, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Users, 
  Calendar, 
  Clock, 
  Trophy,
  X,
  ExternalLink,
  Home,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]

const SUITES = [
  { key: 'camera_1', name: 'Camera 1' },
  { key: 'camera_2', name: 'Camera 2' },
  { key: 'camera_3', name: 'Camera 3' },
  { key: 'camera_4', name: 'Camera 4' },
]

interface CalendarEvent {
  uid: string
  summary: string
  description: string
  dtstart: string
  dtend: string
  nights: number
}

interface SuiteData {
  name: string
  events: CalendarEvent[]
  bookedDates: string[]
  lastSync: string | null
}

interface SyncResult {
  count: number
  bookedDatesCount: number
  error?: string
}

interface SyncResults {
  [key: string]: SyncResult
}

interface CalendarData {
  suites: Record<string, SuiteData>
  lastSync?: string
}

interface Reservation {
  suite: string
  suiteName: string
  summary: string
  checkIn: string
  checkOut: string
  nights: number
  uid: string
  status: 'passata' | 'in_corso' | 'futura'
}

interface Stats {
  total: number
  thisMonth: number
  nightsThisMonth: number
  nextCheckIn: string | null
  mostBooked: string | null
}

// Format date as DD/MM/YYYY
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// Format date with weekday
const formatDateLong = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('it-IT', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  })
}

// Get guest name from summary (show "Airbnb Guest" if just "Reserved")
const getGuestName = (summary: string) => {
  if (!summary || summary.toLowerCase() === 'reserved' || summary.toLowerCase() === 'prenotato') {
    return 'Airbnb Guest'
  }
  return summary
}

// Get initials from name
const getInitials = (name: string) => {
  if (!name || name === 'Airbnb Guest' || name.toLowerCase() === 'reserved') return ''
  const parts = name.split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Sync status indicator component
const SyncStatusIndicator = ({ 
  suiteKey, 
  suiteData, 
  syncResults 
}: { 
  suiteKey: string
  suiteData?: SuiteData
  syncResults?: SyncResult
}) => {
  const hasError = syncResults?.error
  const hasData = suiteData && suiteData.lastSync
  const eventsCount = suiteData?.events?.length || 0
  
  let icon = <AlertCircle size={14} color="#9ca3af" />
  let color = '#9ca3af'
  let label = 'Mai sincronizzato'
  
  if (hasError) {
    icon = <XCircle size={14} color="#ef4444" />
    color = '#ef4444'
    label = `Errore: ${syncResults.error}`
  } else if (hasData) {
    icon = <CheckCircle size={14} color="#22c55e" />
    color = '#22c55e'
    label = `${eventsCount} prenotazioni`
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 6,
      fontFamily: "'Jost', sans-serif",
      fontSize: 12,
      color,
    }}>
      {icon}
      <span>{label}</span>
    </div>
  )
}

// Toast notification component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])
  
  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      backgroundColor: '#1A2B3C',
      color: '#fff',
      padding: '16px 24px',
      borderRadius: 4,
      fontFamily: "'Jost', sans-serif",
      fontSize: 14,
      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      zIndex: 1001,
      maxWidth: 400,
      animation: 'slideIn 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CheckCircle size={20} color="#22c55e" />
        <div dangerouslySetInnerHTML={{ __html: message.replace(/\n/g, '<br/>') }} />
      </div>
    </div>
  )
}

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    passata: { bg: '#f3f4f6', color: '#6b7280', label: 'Passata' },
    in_corso: { bg: '#dcfce7', color: '#16a34a', label: 'In corso' },
    futura: { bg: '#fef3c7', color: '#d97706', label: 'Futura' },
  }
  const style = styles[status as keyof typeof styles] || styles.passata
  
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: style.bg,
      color: style.color,
      fontFamily: "'Jost', sans-serif",
    }}>
      {style.label}
    </span>
  )
}

export default function CalendarioPage() {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedSuite, setSelectedSuite] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [lastSync, setLastSync] = useState<string>('')
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Fetch calendar data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [calRes, resRes] = await Promise.all([
        fetch('/api/calendar').then(r => r.json()),
        fetch('/api/admin/calendar/reservations').then(r => r.json()),
      ])
      
      if (calRes.suites) {
        setCalendarData(calRes)
        setLastSync(calRes.lastSync || '')
      }
      if (resRes.reservations) {
        setReservations(resRes.reservations)
        setStats(resRes.stats)
        setLastSync(resRes.lastSync || '')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Sync calendars
  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await fetch('/api/admin/ical/sync', { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setSyncResults(data.results)
        await fetchData()
        
        // Build toast message
        const results = data.results as SyncResults
        const parts = Object.entries(results).map(([key, result]) => {
          const suiteName = SUITES.find(s => s.key === key)?.name || key
          if (result.error) {
            return `${suiteName}: errore`
          }
          return `${suiteName} (${result.count} date)`
        })
        setToastMessage(`Sincronizzazione completata:\n${parts.join(' · ')}`)
      } else {
        setToastMessage('Errore durante la sincronizzazione')
      }
    } catch (error) {
      console.error('Sync error:', error)
      setToastMessage('Errore durante la sincronizzazione')
    } finally {
      setSyncing(false)
    }
  }

  // Filter events based on selected suite
  const currentEvents = useMemo(() => {
    if (!calendarData?.suites) return []
    
    if (selectedSuite === 'all') {
      return Object.values(calendarData.suites).flatMap(s => s.events || [])
    }
    return calendarData.suites[selectedSuite]?.events || []
  }, [calendarData, selectedSuite])

  // Get booked dates for current view
  const bookedDates = useMemo(() => {
    if (!calendarData?.suites) return []
    
    if (selectedSuite === 'all') {
      return Object.values(calendarData.suites).flatMap(s => s.bookedDates || [])
    }
    return calendarData.suites[selectedSuite]?.bookedDates || []
  }, [calendarData, selectedSuite])

  // Get events for a specific date
  const getEventsForDate = (dateStr: string) => {
    return currentEvents.filter(e => {
      const start = new Date(e.dtstart)
      const end = new Date(e.dtend)
      const current = new Date(dateStr)
      return current >= start && current < end
    })
  }

  // Check if date is first day of event
  const isFirstDay = (dateStr: string) => {
    return currentEvents.some(e => e.dtstart === dateStr)
  }

  // Check if date is last day of event
  const isLastDay = (dateStr: string) => {
    return currentEvents.some(e => {
      const end = new Date(e.dtend)
      const prevDay = new Date(end)
      prevDay.setDate(prevDay.getDate() - 1)
      return prevDay.toISOString().split('T')[0] === dateStr
    })
  }

  // Navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Calendar grid
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  const today = new Date()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  // Filter reservations for table
  const tableReservations = useMemo(() => {
    let filtered = reservations
    if (selectedSuite !== 'all') {
      filtered = reservations.filter(r => r.suite === selectedSuite)
    }
    return filtered.slice(0, 50) // Limit to 50 most recent
  }, [reservations, selectedSuite])

  // Suite name for title
  const suiteTitle = selectedSuite === 'all' ? 'Tutte le Suite' : SUITES.find(s => s.key === selectedSuite)?.name || ''

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* Header with sync button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: 'italic',
            fontSize: 32,
            color: '#1A2B3C',
            fontWeight: 500,
            margin: 0,
          }}>
            Calendario
          </h1>
          
          {/* Sync status per camera */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '16px 24px',
            marginTop: 12,
          }}>
            {SUITES.map(suite => (
              <div key={suite.key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  color: 'rgba(26,43,60,0.7)',
                  fontWeight: 500,
                }}>{suite.name}:</span>
                <SyncStatusIndicator 
                  suiteKey={suite.key}
                  suiteData={calendarData?.suites?.[suite.key]}
                  syncResults={syncResults?.[suite.key]}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12 }}>
          {lastSync && (
            <span style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 12,
              color: 'rgba(26,43,60,0.5)',
            }}>
              Ultimo aggiornamento: {new Date(lastSync).toLocaleString('it-IT', { 
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              backgroundColor: '#C4935A',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              fontFamily: "'Jost', sans-serif",
              fontSize: 13,
              cursor: syncing ? 'not-allowed' : 'pointer',
              opacity: syncing ? 0.7 : 1,
            }}
          >
            <RefreshCw size={16} style={{ animation: syncing ? 'spin 1s linear infinite' : 'none' }} />
            {syncing ? 'Sincronizzazione...' : 'Sincronizza tutte'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Calendar size={18} color="#C4935A" />
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(26,43,60,0.4)',
              }}>Prenotazioni totali</span>
            </div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              color: '#1A2B3C',
              fontWeight: 500,
              margin: 0,
            }}>{stats.total}</p>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Clock size={18} color="#C4935A" />
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(26,43,60,0.4)',
              }}>Notti questo mese</span>
            </div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 32,
              color: '#1A2B3C',
              fontWeight: 500,
              margin: 0,
            }}>{stats.nightsThisMonth}</p>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Users size={18} color="#C4935A" />
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(26,43,60,0.4)',
              }}>Prossimo check-in</span>
            </div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              color: '#1A2B3C',
              fontWeight: 500,
              margin: 0,
            }}>
              {stats.nextCheckIn ? formatDate(stats.nextCheckIn) : '—'}
            </p>
          </div>

          <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <Trophy size={18} color="#C4935A" />
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(26,43,60,0.4)',
              }}>Suite più prenotata</span>
            </div>
            <p style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              color: '#1A2B3C',
              fontWeight: 500,
              margin: 0,
            }}>
              {stats.mostBooked ? SUITES.find(s => s.key === stats.mostBooked)?.name : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Suite Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid rgba(26,43,60,0.08)' }}>
        {[{ key: 'all', name: 'Tutte' }, ...SUITES].map((suite) => (
          <button
            key={suite.key}
            onClick={() => setSelectedSuite(suite.key)}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: selectedSuite === suite.key ? '2px solid #C4935A' : '2px solid transparent',
              fontFamily: "'Jost', sans-serif",
              fontSize: 14,
              color: selectedSuite === suite.key ? '#1A2B3C' : 'rgba(26,43,60,0.5)',
              fontWeight: selectedSuite === suite.key ? 500 : 400,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {suite.name}
          </button>
        ))}
      </div>

      {/* Calendar */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24, marginBottom: 24 }}>
        {/* Month navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <button
            onClick={prevMonth}
            style={{
              border: '1px solid rgba(26,43,60,0.15)',
              backgroundColor: 'transparent',
              borderRadius: 2,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronLeft size={18} color="#1A2B3C" />
          </button>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#1A2B3C', margin: 0, fontWeight: 500 }}>
            {MONTHS[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={nextMonth}
            style={{
              border: '1px solid rgba(26,43,60,0.15)',
              backgroundColor: 'transparent',
              borderRadius: 2,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={18} color="#1A2B3C" />
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {DAYS.map((d) => (
            <div
              key={d}
              style={{
                textAlign: 'center',
                padding: '8px 0',
                fontFamily: "'Jost', sans-serif",
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(26,43,60,0.4)',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} style={{ padding: 12, minHeight: 70 }} />
            }
            
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isBooked = bookedDates.includes(dateStr)
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
            const isPast = new Date(dateStr) < new Date(today.toISOString().split('T')[0])
            const firstDay = isFirstDay(dateStr)
            const lastDay = isLastDay(dateStr)
            const dayEvents = getEventsForDate(dateStr)
            const guestInitials = dayEvents.length > 0 ? getInitials(dayEvents[0].summary) : ''
            
            return (
              <div
                key={day}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    const res = reservations.find(r => r.uid === dayEvents[0].uid)
                    if (res) setSelectedReservation(res)
                  }
                }}
                style={{
                  padding: '8px',
                  minHeight: 70,
                  textAlign: 'center',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 14,
                  color: isBooked ? '#1A2B3C' : 'rgba(26,43,60,0.6)',
                  backgroundColor: isBooked ? 'rgba(196,147,90,0.15)' : isToday ? '#fff' : 'transparent',
                  border: isToday ? '2px solid #1A2B3C' : isBooked ? '1px solid #C4935A' : '1px solid rgba(26,43,60,0.08)',
                  borderLeft: firstDay ? '3px solid #C4935A' : undefined,
                  borderRight: lastDay ? '3px solid #C4935A' : undefined,
                  opacity: isPast && !isToday ? 0.4 : 1,
                  cursor: isBooked ? 'pointer' : 'default',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <span style={{ fontWeight: isToday ? 600 : 400 }}>{day}</span>
                {guestInitials && (
                  <span style={{
                    fontSize: 10,
                    color: '#C4935A',
                    marginTop: 4,
                    fontWeight: 500,
                  }}>
                    {guestInitials}
                  </span>
                )}
                {firstDay && (
                  <span style={{
                    fontSize: 8,
                    color: '#C4935A',
                    marginTop: 2,
                  }}>
                    Check-in
                  </span>
                )}
                {lastDay && (
                  <span style={{
                    fontSize: 8,
                    color: '#C4935A',
                    marginTop: 2,
                  }}>
                    Check-out
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(26,43,60,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, backgroundColor: 'rgba(196,147,90,0.15)', border: '1px solid #C4935A' }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.5)' }}>Prenotato</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, border: '2px solid #1A2B3C' }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.5)' }}>Oggi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, borderLeft: '3px solid #C4935A', backgroundColor: 'rgba(196,147,90,0.15)' }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.5)' }}>Check-in / Check-out</span>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24 }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22,
          color: '#1A2B3C',
          margin: '0 0 20px 0',
          fontWeight: 500,
        }}>
          Prenotazioni — {suiteTitle}
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          </div>
        ) : tableReservations.length === 0 ? (
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: 14,
            color: 'rgba(26,43,60,0.5)',
            textAlign: 'center',
            padding: 40,
          }}>
            Nessuna prenotazione trovata
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(26,43,60,0.08)' }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(26,43,60,0.4)',
                    fontWeight: 500,
                  }}>Ospite</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(26,43,60,0.4)',
                    fontWeight: 500,
                  }}>Check-in</th>
                  <th style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(26,43,60,0.4)',
                    fontWeight: 500,
                  }}>Check-out</th>
                  <th style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(26,43,60,0.4)',
                    fontWeight: 500,
                  }}>Notti</th>
                  <th style={{
                    textAlign: 'center',
                    padding: '12px 16px',
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'rgba(26,43,60,0.4)',
                    fontWeight: 500,
                  }}>Stato</th>
                </tr>
              </thead>
              <tbody>
                {tableReservations.map((reservation) => (
                  <tr
                    key={reservation.uid}
                    onClick={() => setSelectedReservation(reservation)}
                    style={{
                      borderBottom: '1px solid rgba(26,43,60,0.05)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(196,147,90,0.03)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <td style={{
                      padding: '16px',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: '#1A2B3C',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <User size={16} color="#C4935A" />
                        {getGuestName(reservation.summary)}
                      </div>
                    </td>
                    <td style={{
                      padding: '16px',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: '#1A2B3C',
                    }}>{formatDate(reservation.checkIn)}</td>
                    <td style={{
                      padding: '16px',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: '#1A2B3C',
                    }}>{formatDate(reservation.checkOut)}</td>
                    <td style={{
                      padding: '16px',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 14,
                      color: '#1A2B3C',
                      textAlign: 'center',
                    }}>{reservation.nights}</td>
                    <td style={{
                      padding: '16px',
                      textAlign: 'center',
                    }}>
                      <StatusBadge status={reservation.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            maxWidth: 420,
            backgroundColor: '#fff',
            boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
            zIndex: 1000,
            borderLeft: '3px solid #C4935A',
            padding: 32,
            overflowY: 'auto',
          }}
        >
          <button
            onClick={() => setSelectedReservation(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
            }}
          >
            <X size={24} color="#1A2B3C" />
          </button>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 24,
            color: '#1A2B3C',
            margin: '0 0 32px 0',
            fontWeight: 500,
          }}>
            Dettagli Prenotazione
          </h2>

          <div style={{ marginBottom: 24 }}>
            {/* Suite */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Home size={18} color="#C4935A" />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(26,43,60,0.5)',
                }}>Suite</span>
              </div>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 16,
                color: '#1A2B3C',
                margin: 0,
                paddingLeft: 30,
              }}>
                {selectedReservation.suiteName}
              </p>
            </div>

            {/* Guest */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <User size={18} color="#C4935A" />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(26,43,60,0.5)',
                }}>Ospite</span>
              </div>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 16,
                color: '#1A2B3C',
                margin: 0,
                paddingLeft: 30,
              }}>
                {getGuestName(selectedReservation.summary)}
              </p>
            </div>

            {/* Check-in */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Calendar size={18} color="#C4935A" />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(26,43,60,0.5)',
                }}>Check-in</span>
              </div>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 16,
                color: '#1A2B3C',
                margin: 0,
                paddingLeft: 30,
              }}>
                {formatDateLong(selectedReservation.checkIn)}
              </p>
            </div>

            {/* Check-out */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Calendar size={18} color="#C4935A" />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(26,43,60,0.5)',
                }}>Check-out</span>
              </div>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 16,
                color: '#1A2B3C',
                margin: 0,
                paddingLeft: 30,
              }}>
                {formatDateLong(selectedReservation.checkOut)}
              </p>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <Clock size={18} color="#C4935A" />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(26,43,60,0.5)',
                }}>Durata</span>
              </div>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 16,
                color: '#1A2B3C',
                margin: 0,
                paddingLeft: 30,
              }}>
                {selectedReservation.nights} notti
              </p>
            </div>

            {/* Status */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                <FileText size={18} color="#C4935A" />
                <span style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: 'rgba(26,43,60,0.5)',
                }}>Stato</span>
              </div>
              <div style={{ paddingLeft: 30 }}>
                <StatusBadge status={selectedReservation.status} />
              </div>
            </div>

            {/* UID */}
            <div style={{ marginBottom: 24 }}>
              <span style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'rgba(26,43,60,0.5)',
              }}>ID Prenotazione</span>
              <p style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 12,
                color: 'rgba(26,43,60,0.6)',
                margin: '8px 0 0 0',
                wordBreak: 'break-all',
              }}>
                {selectedReservation.uid}
              </p>
            </div>

            {/* Airbnb Link */}
            <a
              href={`https://www.airbnb.it/hosting/reservations/details/${selectedReservation.uid.split('@')[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '14px 24px',
                backgroundColor: '#FF5A5F',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: 4,
                fontFamily: "'Jost', sans-serif",
                fontSize: 14,
                fontWeight: 500,
                marginTop: 32,
              }}
            >
              <ExternalLink size={16} />
              Apri su Airbnb
            </a>
          </div>
        </div>
      )}

      {/* Overlay for modal */}
      {selectedReservation && (
        <div
          onClick={() => setSelectedReservation(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999,
          }}
        />
      )}

      {/* Toast notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
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
    </div>
  )
}
