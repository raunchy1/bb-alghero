import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

function parseIcal(icalString: string): string[] {
  const bookedDates: string[] = []
  const lines = icalString.split(/\r?\n/)
  let inEvent = false
  let dtStart = ''
  let dtEnd = ''

  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true
      dtStart = ''
      dtEnd = ''
    }

    if (line === 'END:VEVENT' && inEvent) {
      if (dtStart && dtEnd) {
        const start = new Date(dtStart.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
        const end = new Date(dtEnd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'))
        const current = new Date(start)
        while (current < end) {
          bookedDates.push(current.toISOString().split('T')[0])
          current.setDate(current.getDate() + 1)
        }
      }
      inEvent = false
    }

    if (inEvent) {
      if (line.startsWith('DTSTART')) {
        dtStart = line.split(':').pop()?.trim() || ''
      }
      if (line.startsWith('DTEND')) {
        dtEnd = line.split(':').pop()?.trim() || ''
      }
    }
  }

  return Array.from(new Set(bookedDates)).sort()
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'URL non fornito.' }, { status: 400 })
    }

    // Fetch iCal data
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })

    if (!response.ok) {
      return NextResponse.json({
        error: 'Impossibile raggiungere il calendario Airbnb. Verifica il link.',
      }, { status: 400 })
    }

    const icalData = await response.text()

    if (!icalData.includes('BEGIN:VCALENDAR')) {
      return NextResponse.json({
        error: 'Il link non contiene un calendario valido.',
      }, { status: 400 })
    }

    const bookedDates = parseIcal(icalData)

    // Save to data/calendar.json
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

    const calendarData = {
      url,
      lastSync: new Date().toISOString(),
      bookedDates,
      count: bookedDates.length,
    }

    fs.writeFileSync(
      path.join(dataDir, 'calendar.json'),
      JSON.stringify(calendarData, null, 2)
    )

    return NextResponse.json({
      success: true,
      count: bookedDates.length,
      bookedDates,
      lastSync: new Date().toLocaleString('it-IT'),
    })
  } catch {
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 })
  }
}
