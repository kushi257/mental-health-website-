import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('userId')
  response.cookies.delete('userName')
  response.cookies.delete('screenerDone')
  return response
}
