import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const counsellors = await prisma.counsellor.findMany({
      where: { available: true },
    })
    return NextResponse.json({ counsellors })
  } catch {
    return NextResponse.json({ counsellors: [] })
  }
}

export async function POST(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const { counsellorId, slotTime, counsellorName } = await req.json()

    // Mark counsellor slot as taken
    await prisma.counsellor.update({
      where: { id: counsellorId },
      data: { available: false },
    })

    const booking = await prisma.booking.create({
      data: { userId, counsellorId, slotTime, counsellorName, status: 'confirmed' },
    })
    return NextResponse.json({ booking })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET_BOOKINGS(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ bookings: [] })

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ bookings })
  } catch {
    return NextResponse.json({ bookings: [] })
  }
}
