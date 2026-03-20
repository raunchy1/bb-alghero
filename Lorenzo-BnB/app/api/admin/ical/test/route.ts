import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ valid: false, message: 'Inserisci un URL prima di testare.' })
    }

    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })

    if (!response.ok) {
      return NextResponse.json({ valid: false, message: 'Link non raggiungibile. Verifica che sia corretto.' })
    }

    const text = await response.text()

    if (!text.includes('BEGIN:VCALENDAR')) {
      return NextResponse.json({ valid: false, message: 'Il link non contiene un calendario valido.' })
    }

    const eventCount = (text.match(/BEGIN:VEVENT/g) || []).length

    return NextResponse.json({
      valid: true,
      message: `Connessione riuscita! Trovate ${eventCount} prenotazioni nel calendario Airbnb.`,
    })
  } catch {
    return NextResponse.json({ valid: false, message: 'Errore di connessione. Riprova.' })
  }
}
