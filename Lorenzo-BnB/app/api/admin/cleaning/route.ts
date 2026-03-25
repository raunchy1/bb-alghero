import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tasks = await prisma.cleaningTask.findMany({
      include: { room: true },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch cleaning tasks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    
    const task = await prisma.cleaningTask.create({
      data: {
        roomId: parseInt(data.roomId),
        date: new Date(data.date),
        assignedTo: data.assignedTo,
        notes: data.notes,
        status: 'pending',
      },
    })
    
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json()
    
    const updateData: any = {}
    if (data.status) updateData.status = data.status
    if (data.assignedTo) updateData.assignedTo = data.assignedTo
    if (data.notes) updateData.notes = data.notes
    if (data.checklist) updateData.checklist = data.checklist
    if (data.status === 'done') updateData.completedAt = new Date()
    
    const task = await prisma.cleaningTask.update({
      where: { id: parseInt(id) },
      data: updateData,
    })
    
    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }
}
