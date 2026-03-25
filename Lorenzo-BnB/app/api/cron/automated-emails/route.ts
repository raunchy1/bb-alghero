import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, getCheckInReminderTemplate, getReviewRequestTemplate } from '@/lib/email'

// This endpoint should be called by a cron job daily
// Vercel Cron: 0 10 * * * (daily at 10 AM)

export async function GET(req: Request) {
  // Verify cron secret
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results = {
    remindersSent: 0,
    reviewRequestsSent: 0,
    errors: [] as string[],
  }

  try {
    const now = new Date()
    
    // 1. Check-in reminders (send 1 day before)
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)
    
    const tomorrowEnd = new Date(tomorrow)
    tomorrowEnd.setHours(23, 59, 59, 999)
    
    const upcomingCheckIns = await prisma.booking.findMany({
      where: {
        checkIn: {
          gte: tomorrow,
          lte: tomorrowEnd,
        },
        paymentStatus: { not: 'cancelled' },
      },
      include: { room: true },
    })
    
    for (const booking of upcomingCheckIns) {
      if (booking.guestEmail) {
        try {
          const template = getCheckInReminderTemplate(
            booking.guestName,
            booking.room.name,
            booking.checkIn.toISOString(),
            booking.id
          )
          const sent = await sendEmail(booking.guestEmail, template)
          if (sent) results.remindersSent++
        } catch (e) {
          results.errors.push(`Reminder failed for booking ${booking.id}`)
        }
      }
    }
    
    // 2. Review requests (send 1 day after check-out)
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    
    const yesterdayEnd = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)
    
    const recentCheckOuts = await prisma.booking.findMany({
      where: {
        checkOut: {
          gte: yesterday,
          lte: yesterdayEnd,
        },
        paymentStatus: 'paid',
      },
      include: { room: true },
    })
    
    for (const booking of recentCheckOuts) {
      if (booking.guestEmail) {
        try {
          const template = getReviewRequestTemplate(
            booking.guestName,
            booking.room.name,
            booking.id
          )
          const sent = await sendEmail(booking.guestEmail, template)
          if (sent) results.reviewRequestsSent++
        } catch (e) {
          results.errors.push(`Review request failed for booking ${booking.id}`)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
