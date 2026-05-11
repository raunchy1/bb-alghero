export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    // Get settings from database
    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    
    // Get webhook secret (database first, then env)
    const webhookSecret = settings?.stripeWebhookSecret || process.env.STRIPE_WEBHOOK_SECRET

    // Determine which key to use based on mode
    const isTestMode = settings?.stripeMode === 'test'
    let stripeSecretKey = isTestMode 
      ? settings?.stripeTestSecretKey 
      : settings?.stripeSecretKey
    
    // Fallback to environment
    if (!stripeSecretKey) {
      stripeSecretKey = isTestMode 
        ? process.env.STRIPE_TEST_SECRET_KEY 
        : process.env.STRIPE_SECRET_KEY
    }

    if (!stripeSecretKey) {
      console.error('Stripe secret key not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey)

    let event: Stripe.Event

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message)
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
      }
    } else {
      // For testing without webhook secret
      console.warn('Webhook secret not configured, parsing event directly')
      event = JSON.parse(body) as Stripe.Event
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId

        if (bookingId) {
          try {
            await prisma.booking.update({
              where: { id: parseInt(bookingId) },
              data: { 
                paymentStatus: 'paid',
                stripeSessionId: session.id,
              },
            })
            console.log(`✅ Booking ${bookingId} marked as paid (Test: ${session.metadata?.testMode || 'false'})`)
          } catch (dbError) {
            console.error('Failed to update booking:', dbError)
          }
        }
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const bookingId = session.metadata?.bookingId
        
        if (bookingId) {
          try {
            await prisma.booking.update({
              where: { id: parseInt(bookingId) },
              data: { paymentStatus: 'cancelled' },
            })
            console.log(`❌ Booking ${bookingId} expired`)
          } catch (dbError) {
            console.error('Failed to update expired booking:', dbError)
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.error('Payment failed:', paymentIntent.last_payment_error)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed', details: error.message }, { status: 400 })
  }
}
