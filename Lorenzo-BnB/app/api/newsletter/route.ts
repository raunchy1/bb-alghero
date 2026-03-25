import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { email, name, source = 'website' } = await req.json()
    
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email valida richiesta' }, { status: 400 })
    }
    
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    })
    
    if (existing) {
      if (!existing.isActive) {
        // Reactivate
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        })
        return NextResponse.json({ success: true, message: 'Iscrizione riattivata!' })
      }
      return NextResponse.json({ success: true, message: 'Già iscritto!' })
    }
    
    await prisma.newsletterSubscriber.create({
      data: { email, name, source },
    })
    
    return NextResponse.json({ success: true, message: 'Iscrizione completata!' })
  } catch (error) {
    return NextResponse.json({ error: 'Errore durante l\'iscrizione' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { email } = await req.json()
    
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    })
    
    return NextResponse.json({ success: true, message: 'Disiscrizione completata' })
  } catch (error) {
    return NextResponse.json({ error: 'Errore' }, { status: 500 })
  }
}
