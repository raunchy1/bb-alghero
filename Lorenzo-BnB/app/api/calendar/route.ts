import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Map room slugs to camera keys
const roomToCameraMap: Record<string, string> = {
  'suite-luxury-tripla': 'camera_1',
  'suite-luxury-4-pax': 'camera_2',
  'stanza-luxury-3-pax': 'camera_3',
  'stanza-luxury-2-pax': 'camera_4',
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const roomSlug = searchParams.get('room')

    // Read from data/calendar.json (synced via admin)
    const calPath = path.join(process.cwd(), 'data', 'calendar.json')
    
    if (fs.existsSync(calPath)) {
      const data = JSON.parse(fs.readFileSync(calPath, 'utf8'))
      
      // If new format with suites
      if (data.suites) {
        // If room slug provided, return specific suite's booked dates
        if (roomSlug && roomToCameraMap[roomSlug]) {
          const cameraKey = roomToCameraMap[roomSlug]
          const suiteData = data.suites[cameraKey]
          if (suiteData && suiteData.bookedDates) {
            return NextResponse.json({ 
              bookedDates: suiteData.bookedDates,
              suite: cameraKey,
              lastSync: data.lastSync,
            })
          }
        }
        
        // Return all suites data
        return NextResponse.json({
          suites: data.suites,
          lastSync: data.lastSync,
        })
      }
      
      // Legacy format - return bookedDates directly
      if (data.bookedDates) {
        return NextResponse.json({ 
          bookedDates: data.bookedDates,
          lastSync: data.lastSync,
        })
      }
    }

    return NextResponse.json({ 
      suites: {},
      bookedDates: [],
      message: 'Calendar not synced yet',
    })
  } catch (error) {
    console.error('Calendar API error:', error)
    return NextResponse.json({ 
      bookedDates: [],
      error: 'Failed to fetch calendar',
    })
  }
}
