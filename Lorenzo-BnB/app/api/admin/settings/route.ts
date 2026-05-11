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
      // Live keys
      stripePublicKey: settings.stripePublicKey,
      hasStripeSecret: settings.stripeSecretKey.length > 0,
      // Test keys
      stripeTestPublicKey: settings.stripeTestPublicKey,
      hasStripeTestSecret: settings.stripeTestSecretKey.length > 0,
      // Mode
      stripeMode: settings.stripeMode,
      // Webhook
      hasWebhookSecret: settings.stripeWebhookSecret.length > 0,
      // Other
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

    interface UpdateData {
      [key: string]: string | number | boolean;
    }
    
    const updateData: UpdateData = {}

    // General settings
    if (body.propertyName !== undefined) updateData.propertyName = body.propertyName
    if (body.whatsappNumber !== undefined) updateData.whatsappNumber = body.whatsappNumber
    if (body.adminEmail !== undefined) updateData.adminEmail = body.adminEmail
    if (body.adminPassword) updateData.adminPassword = body.adminPassword
    
    // Stripe Live Keys
    if (body.stripePublicKey !== undefined) updateData.stripePublicKey = body.stripePublicKey
    if (body.stripeSecretKey) updateData.stripeSecretKey = body.stripeSecretKey
    
    // Stripe Test Keys
    if (body.stripeTestPublicKey !== undefined) updateData.stripeTestPublicKey = body.stripeTestPublicKey
    if (body.stripeTestSecretKey) updateData.stripeTestSecretKey = body.stripeTestSecretKey
    
    // Stripe Mode
    if (body.stripeMode !== undefined) updateData.stripeMode = body.stripeMode
    
    // Webhook Secret
    if (body.stripeWebhookSecret) updateData.stripeWebhookSecret = body.stripeWebhookSecret

    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: updateData,
      create: { id: 1, ...updateData },
    })

    return NextResponse.json({
      propertyName: settings.propertyName,
      // Live keys
      stripePublicKey: settings.stripePublicKey,
      hasStripeSecret: settings.stripeSecretKey.length > 0,
      // Test keys
      stripeTestPublicKey: settings.stripeTestPublicKey,
      hasStripeTestSecret: settings.stripeTestSecretKey.length > 0,
      // Mode
      stripeMode: settings.stripeMode,
      // Webhook
      hasWebhookSecret: settings.stripeWebhookSecret.length > 0,
      // Other
      whatsappNumber: settings.whatsappNumber,
      adminEmail: settings.adminEmail,
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
