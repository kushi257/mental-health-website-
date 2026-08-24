import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  const screenerDone = cookieStore.get('screenerDone')?.value

  if (!userId) {
    redirect('/onboarding')
  }

  if (!screenerDone) {
    redirect('/onboarding/screener')
  }

  redirect('/dashboard')
}
