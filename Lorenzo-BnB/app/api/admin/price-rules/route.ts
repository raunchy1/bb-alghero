import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rules = await prisma.priceRule.findMany({
      include: { room: true },
      orderBy: { startDate: 'asc' },
    })
    return NextResponse.json(rules)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch price rules' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const rule = await prisma.priceRule.create({
      data: {
        roomId: parseInt(data.roomId),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        price: parseFloat(data.price),
        minNights: parseInt(data.minNights) || 1,
        name: data.name,
        isActive: data.isActive ?? true,
      },
    })
    
    return NextResponse.json(rule)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create price rule' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.priceRule.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete price rule' }, { status: 500 })
  }
}
