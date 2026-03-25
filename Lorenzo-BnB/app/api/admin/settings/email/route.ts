import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET email settings
export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      return NextResponse.json({
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        smtpFrom: 'booking@lasuiten4.it',
      })
    }
    
    return NextResponse.json({
      smtpHost: settings.smtpHost,
      smtpPort: settings.smtpPort,
      smtpUser: settings.smtpUser,
      smtpPassword: settings.smtpPassword ? '********' : '',
      smtpFrom: settings.smtpFrom,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

// UPDATE email settings
export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const existing = await prisma.settings.findFirst()
    
    const updateData: any = {
      smtpHost: data.smtpHost,
      smtpPort: parseInt(data.smtpPort) || 587,
      smtpUser: data.smtpUser,
      smtpFrom: data.smtpFrom,
    }
    
    // Only update password if provided (not masked)
    if (data.smtpPassword && data.smtpPassword !== '********') {
      updateData.smtpPassword = data.smtpPassword
    }
    
    if (existing) {
      await prisma.settings.update({
        where: { id: existing.id },
        data: updateData,
      })
    } else {
      await prisma.settings.create({
        data: updateData,
      })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

// Test email
export async function PUT(req: Request) {
  try {
    const { testEmail } = await req.json()
    const { sendEmail, getBookingConfirmationTemplate } = await import('@/lib/email')
    
    const template = getBookingConfirmationTemplate(
      'Test User',
      'Camera 1',
      new Date().toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
      1,
      100,
      999
    )
    
    const success = await sendEmail(testEmail, template)
    
    if (success) {
      return NextResponse.json({ success: true, message: 'Email di test inviata!' })
    } else {
      return NextResponse.json({ error: 'Invio fallito. Verifica le impostazioni SMTP.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'Errore durante l\'invio' }, { status: 500 })
  }
}
