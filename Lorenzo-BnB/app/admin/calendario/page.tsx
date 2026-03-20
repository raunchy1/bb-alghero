'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
]

export default function CalendarioPage() {
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetch('/api/calendar')
      .then((r) => r.json())
      .then((data) => {
        setBookedDates(data.bookedDates || [])
      })
      .catch(console.error)
  }, [])

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

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Monday-based
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)

  const isBooked = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return bookedDates.includes(dateStr)
  }

  const bookedThisMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(isBooked).length
  const availableThisMonth = daysInMonth - bookedThisMonth

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

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
        Calendario
      </h1>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: '16px 24px', flex: 1 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,43,60,0.4)', margin: '0 0 4px 0' }}>
            Prenotate
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#C4935A', fontWeight: 500, margin: 0 }}>
            {bookedThisMonth} <span style={{ fontSize: 14, fontFamily: "'Jost', sans-serif", color: 'rgba(26,43,60,0.4)' }}>giorni</span>
          </p>
        </div>
        <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: '16px 24px', flex: 1 }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(26,43,60,0.4)', margin: '0 0 4px 0' }}>
            Disponibili
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: '#16a34a', fontWeight: 500, margin: 0 }}>
            {availableThisMonth} <span style={{ fontSize: 14, fontFamily: "'Jost', sans-serif", color: 'rgba(26,43,60,0.4)' }}>giorni</span>
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.08)', padding: 24 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
          {cells.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} style={{ padding: 12 }} />
            }
            const booked = isBooked(day)
            const today = new Date()
            const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
            return (
              <div
                key={day}
                style={{
                  padding: 12,
                  textAlign: 'center',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 14,
                  color: booked ? '#fff' : '#1A2B3C',
                  backgroundColor: booked ? '#C4935A' : isToday ? 'rgba(196,147,90,0.08)' : 'transparent',
                  border: isToday && !booked ? '1px solid #C4935A' : '1px solid transparent',
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(26,43,60,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, backgroundColor: '#C4935A' }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.5)' }}>Prenotato</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, border: '1px solid #C4935A' }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.5)' }}>Oggi</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 16, height: 16, backgroundColor: '#fff', border: '1px solid rgba(26,43,60,0.1)' }} />
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(26,43,60,0.5)' }}>Disponibile</span>
          </div>
        </div>
      </div>
    </div>
  )
}
