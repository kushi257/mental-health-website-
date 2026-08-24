import { cookies } from 'next/headers'

export async function getSession(): Promise<{ userId: string; name: string } | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const name = cookieStore.get('userName')?.value
  if (!userId || !name) return null
  return { userId, name }
}

export async function setSession(userId: string, name: string) {
  const cookieStore = await cookies()
  cookieStore.set('userId', userId, { maxAge: 60 * 60 * 24 * 30, path: '/' })
  cookieStore.set('userName', name, { maxAge: 60 * 60 * 24 * 30, path: '/' })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete('userId')
  cookieStore.delete('userName')
}
