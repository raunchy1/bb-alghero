import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: 1 } })

    if (!settings) {
      settings = await prisma.settings.create({ data: { id: 1 } })
    }

    return NextResponse.json({
      propertyName: settings.propertyName,
      stripePublicKey: settings.stripePublicKey,
      hasStripeSecret: settings.stripeSecretKey.length > 0,
      whatsappNumber: settings.whatsappNumber,
      adminEmail: settings.adminEmail,
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const updateData: Record<string, string> = {}

    if (body.propertyName !== undefined) updateData.propertyName = body.propertyName
    if (body.stripePublicKey !== undefined) updateData.stripePublicKey = body.stripePublicKey
    if (body.stripeSecretKey) updateData.stripeSecretKey = body.stripeSecretKey
    if (body.whatsappNumber !== undefined) updateData.whatsappNumber = body.whatsappNumber
    if (body.adminEmail !== undefined) updateData.adminEmail = body.adminEmail
    if (body.adminPassword) updateData.adminPassword = body.adminPassword

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: updateData,
      create: { id: 1, ...updateData },
    })

    return NextResponse.json({
      propertyName: settings.propertyName,
      stripePublicKey: settings.stripePublicKey,
      hasStripeSecret: settings.stripeSecretKey.length > 0,
      whatsappNumber: settings.whatsappNumber,
      adminEmail: settings.adminEmail,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
