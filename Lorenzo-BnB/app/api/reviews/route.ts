import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get approved reviews
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// Submit new review
export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Verify booking exists
    const booking = await prisma.booking.findFirst({
      where: {
        id: parseInt(data.bookingId),
        guestEmail: data.guestEmail,
      },
    })
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    const review = await prisma.review.create({
      data: {
        roomId: booking.roomId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        rating: parseInt(data.rating),
        title: data.title,
        comment: data.comment,
        checkInDate: booking.checkIn,
        isApproved: false, // Requires admin approval
      },
    })
    
    return NextResponse.json({ success: true, review })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
