import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const { exerciseId, exerciseName, category } = await req.json()
    const completion = await prisma.exerciseCompletion.create({
      data: { userId, exerciseId, exerciseName, category },
    })
    return NextResponse.json({ completion })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save completion' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ completions: [] })

  try {
    const completions = await prisma.exerciseCompletion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ completions })
  } catch {
    return NextResponse.json({ completions: [] })
  }
}
