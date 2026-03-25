import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as XLSX from 'xlsx'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'bookings'
    const format = searchParams.get('format') || 'json'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    const where: any = {}
    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      }
    }
    
    let data: any[] = []
    let headers: string[] = []
    
    switch (type) {
      case 'bookings':
        data = await prisma.booking.findMany({
          where,
          include: { room: true },
          orderBy: { createdAt: 'desc' },
        })
        headers = ['ID', 'Camera', 'Ospite', 'Email', 'Check-in', 'Check-out', 'Notti', 'Totale', 'Stato', 'Data Prenotazione']
        data = data.map(b => ({
          'ID': b.id,
          'Camera': b.room?.name || `Camera ${b.roomId}`,
          'Ospite': b.guestName,
          'Email': b.guestEmail,
          'Check-in': new Date(b.checkIn).toLocaleDateString('it-IT'),
          'Check-out': new Date(b.checkOut).toLocaleDateString('it-IT'),
          'Notti': b.nights,
          'Totale': b.totalPrice,
          'Stato': b.paymentStatus,
          'Data Prenotazione': new Date(b.createdAt).toLocaleDateString('it-IT'),
        }))
        break
        
      case 'revenue':
        const bookings = await prisma.booking.findMany({
          where: { ...where, paymentStatus: 'paid' },
        })
        // Group by month
        const revenueByMonth: Record<string, number> = {}
        bookings.forEach(b => {
          const month = new Date(b.checkIn).toLocaleString('it-IT', { month: 'long', year: 'numeric' })
          revenueByMonth[month] = (revenueByMonth[month] || 0) + b.totalPrice
        })
        data = Object.entries(revenueByMonth).map(([month, total]) => ({ Mese: month, 'Fatturato €': total }))
        headers = ['Mese', 'Fatturato €']
        break
        
      case 'guests':
        data = await prisma.booking.findMany({
          where,
          include: { room: true },
          orderBy: { checkIn: 'desc' },
        })
        headers = ['Nome', 'Email', 'Telefono', 'Camera', 'Check-in', 'Check-out']
        data = data.map(b => ({
          'Nome': b.guestName,
          'Email': b.guestEmail,
          'Telefono': b.guestPhone || '',
          'Camera': b.room?.name || `Camera ${b.roomId}`,
          'Check-in': new Date(b.checkIn).toLocaleDateString('it-IT'),
          'Check-out': new Date(b.checkOut).toLocaleDateString('it-IT'),
        }))
        break
    }
    
    if (format === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, type)
      const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
      
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="report-${type}-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      })
    }
    
    return NextResponse.json({ data, headers, type })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
