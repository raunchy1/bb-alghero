import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const settings = await prisma.settings.findUnique({ where: { id: 1 } })

    if (!settings) {
      return NextResponse.json({ error: 'Settings not configured' }, { status: 500 })
    }

    if (email !== settings.adminEmail || password !== settings.adminPassword) {
      return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 })
    }

    // Simple token: base64 of email + timestamp
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return NextResponse.json({ token })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
