import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'manomitra-admin'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('adminSession', 'authenticated', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
