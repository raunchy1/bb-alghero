import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const calPath = path.join(process.cwd(), 'data', 'calendar.json')
    if (!fs.existsSync(calPath)) {
      return NextResponse.json({ url: '', bookedDates: [], lastSync: null })
    }
    const data = JSON.parse(fs.readFileSync(calPath, 'utf8'))
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ url: '', bookedDates: [], lastSync: null })
  }
}
