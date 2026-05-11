import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

// Test checkout endpoint - creates a 1 EUR test product
export async function POST(request: NextRequest) {
  try {
    const { guestEmail = 'test@example.com', guestName = 'Test User' } = await request.json()

    // Get settings from database
    const settings = await prisma.settings.findUnique({ where: { id: 1 } })
    
    // Try database first, then fallback to environment
    let stripeSecretKey = settings?.stripeTestSecretKey
    
    if (!stripeSecretKey) {
      stripeSecretKey = process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY
    }
    
    if (!stripeSecretKey) {
      return NextResponse.json({ 
        error: 'Stripe test key not configured',
        message: 'Please add test keys in Admin → Stripe Setup or set STRIPE_TEST_SECRET_KEY in .env'
      }, { status: 400 })
    }

    const stripe = new Stripe(stripeSecretKey)

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // Create a test booking in database
    const testBooking = await prisma.booking.create({
      data: {
        roomId: 1, // First room
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 86400000), // Tomorrow
        guests: 1,
        guestName,
        guestEmail,
        nights: 1,
        totalPrice: 1.00, // 1 EUR for testing
        paymentStatus: 'pending',
      },
      include: { room: true }
    })

    // Create Stripe checkout session for 1 EUR
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: '🧪 TEST - Produs Test 1 EUR',
              description: 'Acesta este un test de plată - NU se va debita cardul real în modul test',
              images: [],
            },
            unit_amount: 100, // 1.00 EUR in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/booking/test-success?session_id={CHECKOUT_SESSION_ID}&test=true`,
      cancel_url: `${origin}/booking/cancel?test=true`,
      metadata: { 
        bookingId: String(testBooking.id),
        testMode: 'true',
        guestEmail,
        guestName
      },
      customer_email: guestEmail,
      // Test mode specific options
      submit_type: 'pay',
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['IT', 'US', 'GB', 'DE', 'FR'],
      },
    })

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id,
      bookingId: testBooking.id,
      testMode: true,
      message: 'Redirectionare catre Stripe Checkout (mod test)'
    })

  } catch (error: any) {
    console.error('Test checkout error:', error)
    return NextResponse.json({ 
      error: 'Failed to create test checkout', 
      details: error.message 
    }, { status: 500 })
  }
}
