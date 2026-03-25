import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

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
  lastSync: string
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

function getStatus(checkIn: string, checkOut: string): 'passata' | 'in_corso' | 'futura' {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  
  if (end < today) return 'passata'
  if (start <= today && end >= today) return 'in_corso'
  return 'futura'
}

export async function GET() {
  try {
    const calPath = path.join(process.cwd(), 'data', 'calendar.json')
    
    if (!fs.existsSync(calPath)) {
      return NextResponse.json({ 
        reservations: [], 
        stats: { total: 0, thisMonth: 0, nextCheckIn: null, mostBooked: null }
      })
    }

    const data: CalendarData = JSON.parse(fs.readFileSync(calPath, 'utf8'))
    const reservations: Reservation[] = []
    const today = new Date()
    const thisMonth = today.getMonth()
    const thisYear = today.getFullYear()
    
    let totalNightsThisMonth = 0
    let suiteBookings: Record<string, number> = {}
    let nextCheckIn: string | null = null
    let nextCheckInDate: Date | null = null

    for (const [suiteKey, suiteData] of Object.entries(data.suites)) {
      suiteBookings[suiteKey] = suiteData.events?.length || 0
      
      for (const event of (suiteData.events || [])) {
        const checkIn = event.dtstart
        const checkOut = event.dtend
        const status = getStatus(checkIn, checkOut)
        
        // Calculate nights this month
        const startDate = new Date(checkIn)
        const endDate = new Date(checkOut)
        
        // Check if reservation overlaps with this month
        if (startDate.getMonth() === thisMonth && startDate.getFullYear() === thisYear) {
          totalNightsThisMonth += event.nights
        }
        
        // Find next check-in
        if (status === 'futura') {
          const checkInDate = new Date(checkIn)
          if (!nextCheckInDate || checkInDate < nextCheckInDate) {
            nextCheckInDate = checkInDate
            nextCheckIn = checkIn
          }
        }
        
        reservations.push({
          suite: suiteKey,
          suiteName: suiteData.name,
          summary: event.summary,
          checkIn,
          checkOut,
          nights: event.nights,
          uid: event.uid,
          status,
        })
      }
    }

    // Sort by check-in date (most recent first)
    reservations.sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())

    // Find most booked suite
    let mostBooked = null
    let maxBookings = 0
    for (const [suite, count] of Object.entries(suiteBookings)) {
      if (count > maxBookings) {
        maxBookings = count
        mostBooked = suite
      }
    }

    // Count reservations this month
    const thisMonthReservations = reservations.filter(r => {
      const date = new Date(r.checkIn)
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear
    }).length

    const stats = {
      total: reservations.length,
      thisMonth: thisMonthReservations,
      nightsThisMonth: totalNightsThisMonth,
      nextCheckIn,
      mostBooked,
    }

    return NextResponse.json({ reservations, stats, lastSync: data.lastSync })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    )
  }
}
