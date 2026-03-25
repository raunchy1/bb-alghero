import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }
    
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
      include: { room: true },
    })
    
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    
    return NextResponse.json({
      id: booking.id,
      guestName: booking.guestName,
      room: { name: booking.room.name },
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    // Create guest document record
    await prisma.guestDocument.create({
      data: {
        bookingId: parseInt(data.bookingId),
        type: data.documentType,
        number: data.documentNumber,
      },
    })
    
    // Update booking with additional info
    await prisma.booking.update({
      where: { id: parseInt(data.bookingId) },
      data: {
        guestPhone: data.phone,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process check-in' }, { status: 500 })
  }
}
