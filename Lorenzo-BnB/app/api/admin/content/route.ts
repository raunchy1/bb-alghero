import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json')

export async function GET() {
  try {
    const data = await readFile(CONTENT_FILE, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch {
    // Return defaults if file doesn't exist
    return NextResponse.json({
      homepage: { heroTitle: 'La Suite N4', heroSubtitle: 'Terrazze panoramiche private', aboutDescription: '' },
      contact: { phone: '+393478327243', whatsapp: '393478327243', email: 'info@lasuiten4.it', address: 'Alghero, Sardegna', checkinTime: '15:00', checkoutTime: '11:00' },
      partner: { name: 'Sea Star Beach Restaurant', description: '', instagram: '@sea_star_alghero', discountText: 'Sconto esclusivo per i nostri ospiti' },
      seo: { title: 'La Suite N4 Alghero', description: '' },
      icalUrl: '',
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Ensure the data directory exists
    await mkdir(path.dirname(CONTENT_FILE), { recursive: true })
    await writeFile(CONTENT_FILE, JSON.stringify(body, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content save error:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
