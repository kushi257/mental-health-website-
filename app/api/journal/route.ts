import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const body = await req.json()
    const entry = await prisma.journalEntry.create({
      data: {
        userId,
        type: body.type || 'thought_record',
        situation: body.situation || '',
        automaticThought: body.automaticThought || '',
        evidenceFor: body.evidenceFor || '',
        evidenceAgainst: body.evidenceAgainst || '',
        alternativeView: body.alternativeView || '',
        worryText: body.worryText || '',
        deferredTo: body.deferredTo || '',
        activityName: body.activityName || '',
        scheduledFor: body.scheduledFor || '',
        completed: body.completed || false,
        distortionType: body.distortionType || '',
      },
    })
    return NextResponse.json({ entry })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save journal entry' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ entries: [] })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId, ...(type ? { type } : {}) },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ entries })
  } catch {
    return NextResponse.json({ entries: [] })
  }
}

export async function PATCH(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const { id, completed } = await req.json()
    const entry = await prisma.journalEntry.update({
      where: { id, userId },
      data: { completed },
    })
    return NextResponse.json({ entry })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 })
  }
}
