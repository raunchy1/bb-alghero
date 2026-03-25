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
    if (inEvent && line.startsWith('DTSTART')) dtStart = line.split(':').pop()?.trim() || ''
    if (inEvent && line.startsWith('DTEND')) dtEnd = line.split(':').pop()?.trim() || ''
  }
  return Array.from(new Set(bookedDates)).sort()
}

interface SuiteConfig {
  key: string
  name: string
  url: string | undefined
}

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const suites: SuiteConfig[] = [
    { key: 'camera_1', name: 'Suite 1', url: process.env.AIRBNB_ICAL_CAMERA_1 },
    { key: 'camera_2', name: 'Suite 2', url: process.env.AIRBNB_ICAL_CAMERA_2 },
    { key: 'camera_3', name: 'Suite 3', url: process.env.AIRBNB_ICAL_CAMERA_3 },
    { key: 'camera_4', name: 'Suite 4', url: process.env.AIRBNB_ICAL_CAMERA_4 },
  ]

  const results: Record<string, { count: number; error?: string }> = {}
  const suiteData: Record<string, { name: string; icalUrl: string; bookedDates: string[] }> = {}

  for (const suite of suites) {
    if (!suite.url) {
      results[suite.key] = { count: 0, error: 'URL not configured' }
      suiteData[suite.key] = { name: suite.name, icalUrl: '', bookedDates: [] }
      continue
    }

    try {
      const response = await fetch(suite.url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      if (!response.ok) {
        results[suite.key] = { count: 0, error: `HTTP ${response.status}` }
        suiteData[suite.key] = { name: suite.name, icalUrl: suite.url, bookedDates: [] }
        continue
      }

      const icalText = await response.text()
      if (!icalText.includes('BEGIN:VCALENDAR')) {
        results[suite.key] = { count: 0, error: 'Invalid calendar' }
        suiteData[suite.key] = { name: suite.name, icalUrl: suite.url, bookedDates: [] }
        continue
      }

      const bookedDates = parseIcal(icalText)
      results[suite.key] = { count: bookedDates.length }
      suiteData[suite.key] = { name: suite.name, icalUrl: suite.url, bookedDates }
    } catch (e: any) {
      results[suite.key] = { count: 0, error: e.message }
      suiteData[suite.key] = { name: suite.name, icalUrl: suite.url, bookedDates: [] }
    }
  }

  const calPath = path.join(process.cwd(), 'data', 'calendar.json')
  fs.writeFileSync(
    calPath,
    JSON.stringify({ suites: suiteData, lastSync: new Date().toISOString() }, null, 2)
  )

  return NextResponse.json({ success: true, results })
}
