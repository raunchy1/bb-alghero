import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Primary: read from data/calendar.json (synced via admin)
    const calPath = path.join(process.cwd(), 'data', 'calendar.json')
    if (fs.existsSync(calPath)) {
      const data = JSON.parse(fs.readFileSync(calPath, 'utf8'))
      if (data.bookedDates && data.bookedDates.length > 0) {
        return NextResponse.json({ bookedDates: data.bookedDates })
      }
    }

    // Fallback: fetch live from env var
    const AIRBNB_ICAL_URL = process.env.AIRBNB_ICAL_URL || ''
    if (!AIRBNB_ICAL_URL) {
      return NextResponse.json({ bookedDates: [], message: 'iCal URL not configured' })
    }

    const response = await fetch(AIRBNB_ICAL_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const icalData = await response.text()
    const bookedDates = parseIcal(icalData)

    return NextResponse.json({ bookedDates })
  } catch {
    return NextResponse.json({ bookedDates: [], error: 'Failed to fetch calendar' })
  }
}

function parseIcal(icalString: string): string[] {
  const bookedDates: string[] = []
  const lines = icalString.split(/\r?\n/)
  let inEvent = false
  let start = ''
  let end = ''

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') { inEvent = true; start = ''; end = '' }
    if (line === 'END:VEVENT' && inEvent) {
      if (start && end) {
        const startDate = new Date(start.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
        const endDate = new Date(end.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
        const current = new Date(startDate)
        while (current < endDate) {
          bookedDates.push(current.toISOString().split('T')[0])
          current.setDate(current.getDate() + 1)
        }
      }
      inEvent = false
    }
    if (inEvent && line.startsWith('DTSTART')) start = line.split(':').pop()?.trim() || ''
    if (inEvent && line.startsWith('DTEND')) end = line.split(':').pop()?.trim() || ''
  }
  return Array.from(new Set(bookedDates)).sort()
}
