import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ICalEvent {
  uid: string
  summary: string
  description: string
  dtstart: string
  dtend: string
  nights: number
  lastModified?: string
}

/**
 * Parse iCal data and extract events
 * Handles multiple DTSTART/DTEND formats:
 * - DTSTART:20260710 (date only)
 * - DTSTART;TZID=Europe/Rome:20260710T150000 (with timezone)
 * - DTSTART:20260710T150000Z (UTC)
 */
function parseIcal(icalString: string): ICalEvent[] {
  const events: ICalEvent[] = []
  
  // Unfold continuation lines (lines starting with space or tab after newline)
  const unfolded = icalString
    .replace(/\r\n[ \t]/g, '')  // Windows-style continuation
    .replace(/\n[ \t]/g, '')    // Unix-style continuation
    .replace(/\r[ \t]/g, '')    // Old Mac-style continuation
  
  const lines = unfolded.split(/\r?\n/)
  let inEvent = false
  let currentEvent: Partial<ICalEvent> = {}

  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine === 'BEGIN:VEVENT') {
      inEvent = true
      currentEvent = {}
      continue
    }

    if (trimmedLine === 'END:VEVENT' && inEvent) {
      if (currentEvent.dtstart && currentEvent.dtend) {
        try {
          const start = new Date(currentEvent.dtstart)
          const end = new Date(currentEvent.dtend)
          
          // Validate dates
          if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            const nights = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
            
            events.push({
              uid: currentEvent.uid || '',
              summary: currentEvent.summary || 'Reserved',
              description: currentEvent.description || '',
              dtstart: currentEvent.dtstart,
              dtend: currentEvent.dtend,
              nights: nights > 0 ? nights : 1,
              lastModified: currentEvent.lastModified,
            })
          }
        } catch (e) {
          console.error('Error parsing event dates:', e)
        }
      }
      inEvent = false
      currentEvent = {}
      continue
    }

    if (!inEvent) continue

    // Extract date value from DTSTART/DTEND
    // Handles: DTSTART:20260710, DTSTART;TZID=...:20260710T150000, DTSTART:20260710T150000Z
    if (trimmedLine.startsWith('DTSTART')) {
      currentEvent.dtstart = extractDateValue(trimmedLine)
    }
    else if (trimmedLine.startsWith('DTEND')) {
      currentEvent.dtend = extractDateValue(trimmedLine)
    }
    else if (trimmedLine.startsWith('SUMMARY')) {
      currentEvent.summary = extractValue(trimmedLine)
    }
    else if (trimmedLine.startsWith('DESCRIPTION')) {
      currentEvent.description = extractValue(trimmedLine)
    }
    else if (trimmedLine.startsWith('UID')) {
      currentEvent.uid = extractValue(trimmedLine)
    }
    else if (trimmedLine.startsWith('LAST-MODIFIED')) {
      currentEvent.lastModified = extractValue(trimmedLine)
    }
  }

  return events
}

/**
 * Extract date value from iCal date property
 * Input: DTSTART;TZID=Europe/Rome:20260710T150000
 * Output: 2026-07-10 (YYYY-MM-DD format)
 */
function extractDateValue(line: string): string {
  // Find the colon that separates property from value
  const colonIndex = line.indexOf(':')
  if (colonIndex === -1) return ''
  
  const value = line.substring(colonIndex + 1).trim()
  
  // Value could be:
  // - 20260710 (date only)
  // - 20260710T150000 (date-time local)
  // - 20260710T150000Z (date-time UTC)
  
  if (value.length >= 8) {
    const datePart = value.substring(0, 8)
    // Format as YYYY-MM-DD
    const year = datePart.substring(0, 4)
    const month = datePart.substring(4, 6)
    const day = datePart.substring(6, 8)
    return `${year}-${month}-${day}`
  }
  
  return value
}

/**
 * Extract value after first colon
 */
function extractValue(line: string): string {
  const colonIndex = line.indexOf(':')
  if (colonIndex === -1) return ''
  return line.substring(colonIndex + 1).trim()
}

// Generate booked dates array from events
function getBookedDatesFromEvents(events: ICalEvent[]): string[] {
  const bookedDates: string[] = []
  
  for (const event of events) {
    try {
      const start = new Date(event.dtstart)
      const end = new Date(event.dtend)
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        continue
      }
      
      const current = new Date(start)
      
      while (current < end) {
        bookedDates.push(current.toISOString().split('T')[0])
        current.setDate(current.getDate() + 1)
      }
    } catch (e) {
      console.error('Error generating booked dates for event:', event.uid, e)
    }
  }
  
  return Array.from(new Set(bookedDates)).sort()
}

interface SuiteConfig {
  key: string
  name: string
  url: string | undefined
}

export async function POST() {
  try {
    const suites: SuiteConfig[] = [
      { key: 'camera_1', name: 'Camera 1', url: process.env.AIRBNB_ICAL_CAMERA_1 },
      { key: 'camera_2', name: 'Camera 2', url: process.env.AIRBNB_ICAL_CAMERA_2 },
      { key: 'camera_3', name: 'Camera 3', url: process.env.AIRBNB_ICAL_CAMERA_3 },
      { key: 'camera_4', name: 'Camera 4', url: process.env.AIRBNB_ICAL_CAMERA_4 },
    ]

    const results: Record<string, { count: number; bookedDatesCount: number; error?: string }> = {}
    const suiteData: Record<string, { 
      name: string; 
      icalUrl: string; 
      events: ICalEvent[];
      bookedDates: string[];
      lastSync: string;
    }> = {}

    for (const suite of suites) {
      if (!suite.url) {
        results[suite.key] = { count: 0, bookedDatesCount: 0, error: 'URL non configurato' }
        suiteData[suite.key] = {
          name: suite.name,
          icalUrl: '',
          events: [],
          bookedDates: [],
          lastSync: new Date().toISOString(),
        }
        console.log(`[iCal Sync] ${suite.name}: URL non configurato`)
        continue
      }

      try {
        console.log(`[iCal Sync] Fetching ${suite.name}...`)
        
        const response = await fetch(suite.url, {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/calendar,text/plain,*/*',
          },
        })

        if (!response.ok) {
          const errorMsg = `HTTP ${response.status}`
          results[suite.key] = { count: 0, bookedDatesCount: 0, error: errorMsg }
          suiteData[suite.key] = {
            name: suite.name,
            icalUrl: suite.url,
            events: [],
            bookedDates: [],
            lastSync: new Date().toISOString(),
          }
          console.log(`[iCal Sync] ${suite.name}: ${errorMsg}`)
          continue
        }

        const icalData = await response.text()
        
        console.log(`[iCal Sync] ${suite.name}: Received ${icalData.length} bytes`)
        console.log(`[iCal Sync] ${suite.name}: Preview - ${icalData.substring(0, 200).replace(/\n/g, ' ')}`)

        if (!icalData.includes('BEGIN:VCALENDAR')) {
          const errorMsg = 'Calendario non valido (manca BEGIN:VCALENDAR)'
          results[suite.key] = { count: 0, bookedDatesCount: 0, error: errorMsg }
          suiteData[suite.key] = {
            name: suite.name,
            icalUrl: suite.url,
            events: [],
            bookedDates: [],
            lastSync: new Date().toISOString(),
          }
          console.log(`[iCal Sync] ${suite.name}: ${errorMsg}`)
          continue
        }

        const events = parseIcal(icalData)
        const bookedDates = getBookedDatesFromEvents(events)
        
        console.log(`[iCal Sync] ${suite.name}: Found ${events.length} events, ${bookedDates.length} booked dates`)
        
        results[suite.key] = { count: events.length, bookedDatesCount: bookedDates.length }
        suiteData[suite.key] = {
          name: suite.name,
          icalUrl: suite.url,
          events,
          bookedDates,
          lastSync: new Date().toISOString(),
        }
      } catch (e: any) {
        const errorMsg = e.message || 'Errore sconosciuto'
        results[suite.key] = { count: 0, bookedDatesCount: 0, error: errorMsg }
        suiteData[suite.key] = {
          name: suite.name,
          icalUrl: suite.url || '',
          events: [],
          bookedDates: [],
          lastSync: new Date().toISOString(),
        }
        console.error(`[iCal Sync] ${suite.name}: Error - ${errorMsg}`)
      }
    }

    // Save to /data/calendar.json
    const dataDir = path.join(process.cwd(), 'data')
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

    fs.writeFileSync(
      path.join(dataDir, 'calendar.json'),
      JSON.stringify(
        {
          suites: suiteData,
          lastSync: new Date().toISOString(),
        },
        null,
        2
      )
    )

    console.log('[iCal Sync] Complete. Results:', JSON.stringify(results, null, 2))

    return NextResponse.json({
      success: true,
      results,
      lastSync: new Date().toLocaleString('it-IT'),
    })
  } catch (error: any) {
    console.error('[iCal Sync] Fatal error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server', details: error.message },
      { status: 500 }
    )
  }
}
