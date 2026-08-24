import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, isAnonymous } = await req.json()
    const user = await prisma.user.create({
      data: { name: isAnonymous ? 'Anonymous' : name, isAnonymous: !!isAnonymous },
    })
    const res = NextResponse.json({ user })
    res.cookies.set('userId', user.id, { maxAge: 60 * 60 * 24 * 30, path: '/' })
    res.cookies.set('userName', user.name, { maxAge: 60 * 60 * 24 * 30, path: '/' })
    return res
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('userId')?.value
  if (!userId) return NextResponse.json({ user: null })
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: null })
  }
}
