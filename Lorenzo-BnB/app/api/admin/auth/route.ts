import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    let settings = await prisma.settings.findUnique({ where: { id: 1 } })

    if (!settings) {
      // Auto-create default settings if they don't exist yet
      settings = await prisma.settings.create({
        data: {
          id: 1,
          stripePublicKey: '',
          stripeSecretKey: '',
          whatsappNumber: '+393478327243',
          propertyName: 'La Suite N°4',
          adminEmail: 'admin@lasuiten4.it',
          adminPassword: 'admin123',
        },
      })
    }

    if (email !== settings.adminEmail || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
    }

    // Simple token: base64 of email + timestamp
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Auth error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: `Errore interno: ${message}` }, { status: 500 })
  }
}
