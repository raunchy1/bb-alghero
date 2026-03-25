import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const packages = await prisma.specialPackage.findMany({
      where: { 
        isActive: true,
        OR: [
          { validUntil: { gte: new Date() } },
          { validUntil: null },
        ],
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}
