import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { computeScoring } from '@/lib/scoring'

export async function POST(req: NextRequest) {
  try {
    let userId = req.cookies.get('userId')?.value

    // Fallback: If no user session cookie exists, auto-create a user so screener never blocks
    if (!userId) {
      const newUser = await prisma.user.create({
        data: { name: 'Student', isAnonymous: true },
      })
      userId = newUser.id
    }

    const { phq9Answers, gad7Answers } = await req.json()
    const { phq9Score, gad7Score, tier, phq9Band, gad7Band } = computeScoring(
      phq9Answers || [],
      gad7Answers || []
    )

    const result = await prisma.screenerResult.create({
      data: {
        userId,
        phq9Score,
        gad7Score,
        tier,
        answers: JSON.stringify({ phq9Answers, gad7Answers }),
      },
    })

    const response = NextResponse.json({ result, tier, phq9Score, gad7Score, phq9Band, gad7Band })

    // Set cookies on response so middleware & client are synced
    response.cookies.set('userId', userId, { maxAge: 60 * 60 * 24 * 30, path: '/' })
    response.cookies.set('screenerDone', '1', { maxAge: 60 * 60 * 24 * 30, path: '/' })

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to save screener' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ result: null })

  try {
    const result = await prisma.screenerResult.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ result })
  } catch {
    return NextResponse.json({ result: null })
  }
}
