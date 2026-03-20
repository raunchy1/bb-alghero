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
    if (line === 'BEGIN:VEVENT') { inEvent = true; dtStart = ''; dtEnd = '' }
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
    if (inEvent && line.startsWith('DTSTART')) dtStart = line.split(':').pop()?.trim() || ''
    if (inEvent && line.startsWith('DTEND')) dtEnd = line.split(':').pop()?.trim() || ''
  }
  return Array.from(new Set(bookedDates)).sort()
}

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const calPath = path.join(process.cwd(), 'data', 'calendar.json')
    if (!fs.existsSync(calPath)) {
      return NextResponse.json({ message: 'No iCal URL configured' })
    }

    const calData = JSON.parse(fs.readFileSync(calPath, 'utf8'))
    if (!calData.url) {
      return NextResponse.json({ message: 'No URL saved' })
    }

    const response = await fetch(calData.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch iCal' }, { status: 500 })
    }

    const icalText = await response.text()
    const bookedDates = parseIcal(icalText)

    const updated = {
      url: calData.url,
      lastSync: new Date().toISOString(),
      bookedDates,
      count: bookedDates.length,
    }

    fs.writeFileSync(calPath, JSON.stringify(updated, null, 2))

    return NextResponse.json({ success: true, count: bookedDates.length })
  } catch {
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}
