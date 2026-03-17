export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    let event: Stripe.Event

    if (webhookSecret && signature) {
      const settings = await prisma.settings.findUnique({ where: { id: 1 } })
      if (!settings?.stripeSecretKey) {
        return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
      }
      const stripe = new Stripe(settings.stripeSecretKey)
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } else {
      event = JSON.parse(body) as Stripe.Event
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        await prisma.booking.update({
          where: { id: parseInt(bookingId) },
          data: { paymentStatus: 'paid' },
        })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }
}
