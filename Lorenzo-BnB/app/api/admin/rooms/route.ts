import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const { id, name, price, capacity } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 })
    }

    const room = await prisma.room.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        capacity: Number(capacity),
      },
    })

    return NextResponse.json(room)
  } catch (error) {
    console.error('Error updating room:', error)
    return NextResponse.json({ error: 'Failed to update room' }, { status: 500 })
  }
}
