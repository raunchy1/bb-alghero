import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { room: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const settings = await prisma.settings.findUnique({ where: { id: 1 } })

    if (!settings?.stripeSecretKey) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 400 })
    }

    const stripe = new Stripe(settings.stripeSecretKey)
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: booking.room.name,
              description: `${booking.nights} notti`,
            },
            unit_amount: Math.round(booking.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking/cancel`,
      metadata: { bookingId: String(booking.id) },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
