'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Shield, Leaf, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAnonymous && !name.trim()) {
      setError('Please enter your name or choose anonymous mode.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || 'Friend', isAnonymous }),
      })
      if (!res.ok) throw new Error('Failed')
      router.push('/onboarding/screener')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30 animate-float">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">ManoMitra</h1>
          <p className="text-white/80 text-lg">Your confidential mental health companion</p>
        </div>

        {/* Feature chips */}
        <div className="flex gap-3 justify-center mb-8 flex-wrap">
          {['🔒 Confidential', '🌱 Guided Exercises', '💬 Chat Support'].map(f => (
            <span key={f} className="bg-white/15 backdrop-blur-sm text-white text-sm px-4 py-1.5 rounded-full border border-white/20">
              {f}
            </span>
          ))}
        </div>

        {/* Login card */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome 👋</h2>
          <p className="text-gray-500 mb-6 text-sm">
            This is a safe space. Your information is private and never shared.
          </p>

          <form onSubmit={handleStart} className="space-y-5">
            {!isAnonymous && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What should we call you?
                </label>
                <input
                  id="name-input"
                  type="text"
                  className="input-field"
                  placeholder="Your first name or a nickname"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={50}
                />
              </div>
            )}

            {/* Anonymous toggle */}
            <button
              type="button"
              id="anonymous-toggle"
              onClick={() => setIsAnonymous(!isAnonymous)}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200"
              style={{
                borderColor: isAnonymous ? '#0d9488' : '#e2e8f0',
                background: isAnonymous ? '#f0fdfa' : 'white',
              }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAnonymous ? 'bg-teal-100' : 'bg-gray-100'}`}>
                {isAnonymous ? <Shield className="w-5 h-5 text-teal-600" /> : <Eye className="w-5 h-5 text-gray-400" />}
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800 text-sm">
                  {isAnonymous ? 'Anonymous mode ON' : 'Use anonymous mode'}
                </p>
                <p className="text-xs text-gray-500">
                  {isAnonymous ? 'No name stored. Fully private.' : 'Skip sharing your name entirely'}
                </p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${isAnonymous ? 'border-teal-500 bg-teal-500' : 'border-gray-300'}`}>
                {isAnonymous && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
            )}

            <button
              id="start-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-lg py-4"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Setting up...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Begin my journey
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-start gap-2 bg-amber-50 p-3 rounded-xl">
            <Leaf className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700">
              <strong>Note:</strong> ManoMitra is a self-help companion and does not replace professional mental health care. If you are in crisis, please call <strong>iCall: 9152987821</strong> or Tele-MANAS: <strong>14416</strong>.
            </p>
          </div>
        </div>

        <p className="text-white/60 text-center text-xs mt-6">
          For college students · Demo prototype · Not a clinical service
        </p>
      </div>
    </div>
  )
}
