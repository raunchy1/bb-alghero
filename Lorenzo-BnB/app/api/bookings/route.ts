import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ include: { room: true } })
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkIn, checkOut, guests, guestName, guestEmail } = body

    // Support both roomId and roomSlug
    let room
    if (body.roomSlug) {
      room = await prisma.room.findUnique({ where: { slug: body.roomSlug } })
    } else if (body.roomId) {
      room = await prisma.room.findUnique({ where: { id: body.roomId } })
    }
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.max(1, Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)))
    const totalPrice = room.price * nights

    const booking = await prisma.booking.create({
      data: {
        roomId: room.id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        guestName,
        guestEmail,
        nights,
        totalPrice,
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
