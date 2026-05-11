import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 })
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { room: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Get settings from database
    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    
    if (!settings) {
      return NextResponse.json({ 
        error: 'Settings not configured',
        message: 'Please configure Stripe settings in the admin panel'
      }, { status: 400 })
    }

    // Determine which key to use based on mode
    const isTestMode = settings.stripeMode === 'test'
    const stripeSecretKey = isTestMode 
      ? settings.stripeTestSecretKey 
      : settings.stripeSecretKey

    // Fallback to environment variables if database keys are empty
    const finalKey = stripeSecretKey || (isTestMode 
      ? process.env.STRIPE_TEST_SECRET_KEY 
      : process.env.STRIPE_SECRET_KEY)

    if (!finalKey) {
      console.error(`Stripe ${isTestMode ? 'test' : 'live'} secret key not configured`)
      return NextResponse.json({ 
        error: 'Stripe not configured',
        message: `Please configure ${isTestMode ? 'test' : 'live'} Stripe keys in the admin panel or .env file`
      }, { status: 400 })
    }

    const stripe = new Stripe(finalKey)

    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: isTestMode ? `🧪 TEST - ${booking.room.name}` : booking.room.name,
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
      metadata: { 
        bookingId: String(booking.id),
        testMode: String(isTestMode)
      },
      customer_email: booking.guestEmail || undefined,
    })

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      testMode: isTestMode
    })

  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    }, { status: 500 })
  }
}
