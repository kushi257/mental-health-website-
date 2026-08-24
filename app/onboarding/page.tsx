'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Shield, Leaf, ArrowRight, Eye, Sparkles, Check, BarChart2, MessageCircle, Dumbbell, Calendar, ChevronLeft, ChevronRight, Play, LockKeyhole } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface FeatureSlide {
  title: string
  description: string
  icon: LucideIcon
  accent: string
  image: string
  imageAlt: string
  visual: 'mood' | 'chat' | 'exercise' | 'video' | 'booking' | 'safety'
}

const FEATURE_SLIDES: FeatureSlide[] = [
  {
    title: 'Check in with yourself',
    description: 'Log how you are feeling and notice patterns over time.',
    icon: BarChart2,
    accent: 'from-teal-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Soft sunlight over a calm green landscape',
    visual: 'mood',
  },
  {
    title: 'Talk with ManoBot',
    description: 'Put your thoughts into words with a private guided conversation.',
    icon: MessageCircle,
    accent: 'from-emerald-500 to-teal-600',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Friends sharing a quiet conversation',
    visual: 'chat',
  },
  {
    title: 'Find a small next step',
    description: 'Explore guided breathing, grounding, reflection, and planning tools.',
    icon: Dumbbell,
    accent: 'from-violet-500 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Person practicing a quiet mindful exercise',
    visual: 'exercise',
  },
  {
    title: 'Learn in a few minutes',
    description: 'Browse practical, bite-sized videos made for student life.',
    icon: Sparkles,
    accent: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Notebook and laptop ready for learning',
    visual: 'video',
  },
  {
    title: 'Book real support',
    description: 'Find an anonymous one-to-one session with a campus counsellor.',
    icon: Calendar,
    accent: 'from-amber-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'People meeting together around a table',
    visual: 'booking',
  },
  {
    title: 'Keep a safety plan close',
    description: 'Save grounding ideas, trusted contacts, and steps for difficult moments.',
    icon: Shield,
    accent: 'from-rose-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Hands held together in a supportive moment',
    visual: 'safety',
  },
]

function FeatureVisual({ slide }: { slide: FeatureSlide }) {
  const Icon = slide.icon

  if (slide.visual === 'mood') {
    return <div className="flex items-end gap-2"><span className="h-10 w-7 rounded-t-lg bg-teal-200" /><span className="h-16 w-7 rounded-t-lg bg-teal-400" /><span className="h-24 w-7 rounded-t-lg bg-teal-600" /><span className="ml-2 text-3xl">🙂</span></div>
  }

  if (slide.visual === 'chat') {
    return <div className="w-full max-w-xs space-y-2"><div className="w-fit rounded-2xl rounded-tl-none bg-white/90 px-3 py-2 text-xs text-teal-900 shadow-sm">What feels hardest today?</div><div className="ml-auto w-fit rounded-2xl rounded-tr-none bg-teal-700 px-3 py-2 text-xs text-white shadow-sm">I&apos;m feeling overwhelmed.</div></div>
  }

  if (slide.visual === 'exercise') {
    return <div className="grid w-full max-w-xs grid-cols-3 gap-2 text-center text-[10px] font-semibold text-violet-900"><div className="rounded-xl bg-white/85 p-3 shadow-sm"><p className="text-lg">4-7-8</p><p className="mt-1">Breathing</p></div><div className="rounded-xl bg-white/85 p-3 shadow-sm"><p className="text-lg">5-4-3</p><p className="mt-1">Grounding</p></div><div className="rounded-xl bg-white/85 p-3 shadow-sm"><p className="text-lg">1 min</p><p className="mt-1">Reflection</p></div></div>
  }

  if (slide.visual === 'video') {
    return <div className="flex w-full max-w-xs items-center gap-3 rounded-xl bg-white/85 p-3 text-blue-900 shadow-sm"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white"><Play className="ml-0.5 h-4 w-4 fill-current" /></div><div className="min-w-0 text-left"><p className="truncate text-xs font-bold">Understanding stress</p><p className="mt-1 text-[10px] text-blue-700">3 min · Student wellbeing</p></div><Sparkles className="ml-auto h-4 w-4 shrink-0 text-blue-500" /></div>
  }

  if (slide.visual === 'booking') {
    return <div className="grid w-full max-w-xs grid-cols-3 gap-2">{['Mon', 'Wed', 'Fri'].map((day, index) => <div key={day} className={`rounded-xl border p-2 text-center text-[10px] ${index === 1 ? 'border-amber-500 bg-amber-100 text-amber-900' : 'border-white/70 bg-white/70 text-slate-600'}`}><p className="font-bold">{day}</p><p className="mt-1">{index === 1 ? '2 slots' : 'Open'}</p></div>)}</div>
  }

  if (slide.visual === 'safety') {
    return <div className="w-full max-w-xs space-y-2 text-xs text-slate-700"><div className="flex items-center gap-2 rounded-xl bg-white/80 p-2"><Check className="h-3.5 w-3.5 text-rose-600" /> A calming place</div><div className="flex items-center gap-2 rounded-xl bg-white/80 p-2"><Check className="h-3.5 w-3.5 text-rose-600" /> Someone I trust</div></div>
  }

  return <div className="flex items-center gap-3"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/85 shadow-sm"><Icon className="h-7 w-7 text-teal-700" /></div><div className="space-y-2"><span className="block h-2 w-28 rounded-full bg-white/80" /><span className="block h-2 w-20 rounded-full bg-white/60" /><span className="block h-2 w-24 rounded-full bg-white/60" /></div></div>
}

export default function OnboardingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches)
    updateMotionPreference()
    mediaQuery.addEventListener('change', updateMotionPreference)
    return () => mediaQuery.removeEventListener('change', updateMotionPreference)
  }, [])

  useEffect(() => {
    if (carouselPaused || reducedMotion) return
    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % FEATURE_SLIDES.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [carouselPaused, reducedMotion])

  const goToSlide = (index: number) => {
    setActiveSlide((index + FEATURE_SLIDES.length) % FEATURE_SLIDES.length)
  }

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
    <div className="onboarding-shell min-h-screen relative overflow-hidden">
      <div className="onboarding-orb onboarding-orb-one" />
      <div className="onboarding-orb onboarding-orb-two" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <section className="onboarding-copy">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 shadow-lg shadow-teal-900/20">
              <Heart className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="brand-wordmark text-lg text-slate-900">ManoMitra</span>
            <span className="rounded-full border border-teal-200 bg-white/70 px-3 py-1 text-[11px] font-semibold text-teal-700">For student wellbeing</span>
          </div>

          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-teal-700">
              <Sparkles className="h-4 w-4" /> A calmer place to begin
            </p>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
              Make space for how you&apos;re feeling.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
              A private, practical companion for the days that feel too loud, too busy, or simply hard to explain.
            </p>
          </div>

          <div
            className="feature-carousel relative mt-10 max-w-lg overflow-hidden rounded-[2rem] border border-white/80 bg-white/65 p-3 shadow-2xl shadow-teal-900/10 backdrop-blur-sm"
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
            onFocus={() => setCarouselPaused(true)}
            onBlur={() => setCarouselPaused(false)}
            aria-roledescription="carousel"
            aria-label="ManoMitra features"
          >
            <div key={activeSlide} className={`feature-slide min-h-[21rem] rounded-[1.5rem] bg-gradient-to-br ${FEATURE_SLIDES[activeSlide].accent} p-6 text-white`} aria-live="polite">
              {(() => {
                const slide = FEATURE_SLIDES[activeSlide]
                const Icon = slide.icon
                return (
                  <>
                    <div className="feature-slide-picture mb-5 overflow-hidden rounded-2xl"><img src={slide.image} alt={slide.imageAlt} className="h-24 w-full object-cover" /><div className="feature-slide-picture-shade" /></div>
                    <div className="feature-slide-icon mb-6 flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20"><Icon className="h-5 w-5" /></div><span className="brand-wordmark rounded-full bg-white/15 px-3 py-1 text-[10px]">ManoMitra</span></div>
                    <div className="feature-slide-visual flex min-h-28 items-center justify-center"><FeatureVisual slide={slide} /></div>
                    <div className="feature-slide-copy mt-7"><h2 className="text-2xl font-bold tracking-tight">{slide.title}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-white/85">{slide.description}</p></div>
                  </>
                )
              })()}
            </div>
            <button type="button" onClick={() => goToSlide(activeSlide - 1)} aria-label="Previous feature" className="carousel-arrow left-5"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => goToSlide(activeSlide + 1)} aria-label="Next feature" className="carousel-arrow right-5"><ChevronRight className="h-4 w-4" /></button>
            <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Choose a feature">
              {FEATURE_SLIDES.map((slide, index) => <button key={slide.title} type="button" role="tab" aria-selected={activeSlide === index} aria-label={`Show ${slide.title}`} onClick={() => goToSlide(index)} className={`carousel-dot ${activeSlide === index ? 'active' : ''}`} />)}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-600" /> Private by design</span>
            <span className="flex items-center gap-2"><Check className="h-4 w-4 text-teal-600" /> Built for college life</span>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-md lg:justify-self-end">
          <div className="floating-note floating-note-top hidden sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700"><Shield className="h-4 w-4" /></div>
            <div><p className="text-xs font-bold text-slate-800">Your space, your pace</p><p className="text-[11px] text-slate-500">Private from the first step</p></div>
          </div>
          <div className="floating-note floating-note-bottom hidden sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Sparkles className="h-4 w-4" /></div>
            <div><p className="text-xs font-bold text-slate-800">A two-minute check-in</p><p className="text-[11px] text-slate-500">Small steps can still count</p></div>
          </div>

          <div className="glass-card onboarding-form-card p-7 sm:p-9">
            <div className="mb-7">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-teal-700">Start privately</p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome in.</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Choose what feels comfortable. You can use a nickname or stay anonymous.</p>
            </div>

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
          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-700">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-800">Admin access</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-500">For campus staff viewing wellbeing analysis</p>
              </div>
              <a href="/admin/login" className="ml-auto shrink-0 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:border-teal-500 hover:text-teal-700">
                Admin sign in
              </a>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-slate-400">For college students · Demo prototype · Not a clinical service</p>
          </div>
        </section>
      </div>
    </div>
  )
}
