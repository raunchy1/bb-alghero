import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const roomId = searchParams.get('roomId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    if (!roomId || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }
    
    const room = await prisma.room.findUnique({
      where: { id: parseInt(roomId) },
      include: { priceRules: true },
    })
    
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    let totalPrice = 0
    const dailyPrices = []
    
    for (let i = 0; i < nights; i++) {
      const currentDate = new Date(start)
      currentDate.setDate(currentDate.getDate() + i)
      
      // Check for price rule
      const rule = room.priceRules.find(r => 
        r.isActive &&
        currentDate >= r.startDate &&
        currentDate <= r.endDate
      )
      
      const nightPrice = rule ? rule.price : room.price
      totalPrice += nightPrice
      dailyPrices.push({
        date: currentDate.toISOString().split('T')[0],
        price: nightPrice,
        isSpecial: !!rule,
        ruleName: rule?.name || null,
      })
    }
    
    // Apply early bird discount (10% if booked 30+ days in advance)
    const daysUntilCheckIn = Math.ceil((start.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    let discount = 0
    let discountReason = ''
    
    if (daysUntilCheckIn >= 30) {
      discount = totalPrice * 0.1
      discountReason = 'Early Bird (30+ giorni)'
    }
    
    // Long stay discount (5% for 7+ nights)
    if (nights >= 7 && discount === 0) {
      discount = totalPrice * 0.05
      discountReason = 'Soggiorno Lungo (7+ notti)'
    }
    
    const finalPrice = totalPrice - discount
    
    return NextResponse.json({
      roomId: room.id,
      roomName: room.name,
      nights,
      basePrice: room.price,
      totalPrice,
      discount,
      discountReason,
      finalPrice,
      dailyPrices,
      savings: discount,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate price' }, { status: 500 })
  }
}
