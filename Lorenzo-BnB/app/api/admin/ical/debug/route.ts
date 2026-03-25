import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results = []
  
  const suites = [
    { key: 'camera_1', name: 'Camera 1', url: process.env.AIRBNB_ICAL_CAMERA_1 },
    { key: 'camera_2', name: 'Camera 2', url: process.env.AIRBNB_ICAL_CAMERA_2 },
    { key: 'camera_3', name: 'Camera 3', url: process.env.AIRBNB_ICAL_CAMERA_3 },
    { key: 'camera_4', name: 'Camera 4', url: process.env.AIRBNB_ICAL_CAMERA_4 },
  ]

  for (const suite of suites) {
    try {
      if (!suite.url) {
        results.push({
          key: suite.key,
          name: suite.name,
          error: 'URL not configured in environment',
        })
        continue
      }

      console.log(`[iCal Debug] Testing ${suite.name}...`)
      
      const response = await fetch(suite.url, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/calendar,text/plain,*/*',
        },
      })
      
      const text = await response.text()
      const isValid = text.includes('BEGIN:VCALENDAR')
      const eventCount = (text.match(/BEGIN:VEVENT/g) || []).length
      
      // Extract a sample event to show date format
      let sampleEvent = null
      const eventMatch = text.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/)
      if (eventMatch) {
        const eventText = eventMatch[0]
        const dtstartMatch = eventText.match(/DTSTART[^:]*:([\dTZ]+)/)
        const dtendMatch = eventText.match(/DTEND[^:]*:([\dTZ]+)/)
        const summaryMatch = eventText.match(/SUMMARY:(.+)/)
        
        sampleEvent = {
          dtstart: dtstartMatch ? dtstartMatch[0] : 'not found',
          dtend: dtendMatch ? dtendMatch[0] : 'not found',
          summary: summaryMatch ? summaryMatch[1].substring(0, 50) : 'not found',
        }
      }
      
      results.push({
        key: suite.key,
        name: suite.name,
        urlConfigured: true,
        status: response.status,
        statusText: response.statusText,
        contentType: response.headers.get('content-type'),
        contentLength: text.length,
        isValidIcal: isValid,
        eventCount,
        sampleEvent,
        preview: text.substring(0, 500).replace(/\r?\n/g, '\n'),
      })
      
      console.log(`[iCal Debug] ${suite.name}: status=${response.status}, events=${eventCount}`)
    } catch (e: any) {
      results.push({
        key: suite.key,
        name: suite.name,
        error: e.message,
        stack: e.stack,
      })
      console.error(`[iCal Debug] ${suite.name}: Error - ${e.message}`)
    }
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results,
  }, { status: 200 })
}
