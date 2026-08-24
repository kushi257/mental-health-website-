import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const { score, tags, note } = await req.json()
    const log = await prisma.moodLog.create({
      data: {
        userId,
        score: Number(score),
        tags: JSON.stringify(tags || []),
        note: note || '',
      },
    })
    return NextResponse.json({ log })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save mood log' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ logs: [] })

  try {
    const logs = await prisma.moodLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    })
    const parsed = logs.map(l => ({
      ...l,
      tags: JSON.parse(l.tags),
    }))
    return NextResponse.json({ logs: parsed })
  } catch {
    return NextResponse.json({ logs: [] })
  }
}
