'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LockKeyhole, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        setError('Invalid admin credentials.')
        return
      }

      router.push('/admin')
    } catch {
      setError('Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <section className="w-full rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/30">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">ManoMitra</p>
              <h1 className="text-xl font-bold">Admin sign in</h1>
            </div>
          </div>

          <p className="mb-6 text-sm leading-6 text-slate-400">Access aggregate campus wellbeing analysis. Student accounts cannot use this portal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">
              Username
              <input value={username} onChange={event => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500" autoComplete="username" required />
            </label>
            <label className="block text-sm font-medium text-slate-300">
              Password
              <input type="password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500" autoComplete="current-password" required />
            </label>

            {error && <p className="rounded-xl border border-rose-900 bg-rose-950/50 p-3 text-sm text-rose-300">{error}</p>}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60">
              <LockKeyhole className="h-4 w-4" />
              {loading ? 'Signing in...' : 'Sign in to analysis'}
            </button>
          </form>

          <a href="/onboarding" className="mt-6 block text-center text-xs text-slate-500 transition hover:text-cyan-400">Return to student sign in</a>
        </section>
      </div>
    </main>
  )
}
