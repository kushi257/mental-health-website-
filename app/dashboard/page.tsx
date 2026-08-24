'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import {
  Heart, Dumbbell, Video, MessageCircle, Calendar,
  Shield, BarChart2, Users, Star, Leaf, TreePine, Flower2,
  ChevronRight, Award, Zap, Sun, Moon, Cloud, ArrowRight, Sparkles
} from 'lucide-react'

interface DashboardData {
  name: string
  tier: string
  phq9Band: string
  gad7Band: string
  recentMood: number
  completionCount: number
  completions: Array<{ exerciseName: string; category: string; createdAt: string }>
  unlockedBadges: string[]
}

const MOOD_EMOJIS = ['😔', '😕', '😐', '🙂', '😊']
const MOOD_LABELS = ['Struggling', 'Low', 'Okay', 'Good', 'Great']
const MOOD_COLORS = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#14b8a6']

const tiles = [
  { href: '/mood', icon: BarChart2, label: 'Mood Check-in', color: 'from-teal-400 to-teal-600', desc: 'Log & track your mood' },
  { href: '/exercises', icon: Dumbbell, label: 'Exercises', color: 'from-violet-400 to-violet-600', desc: '8 guided self-help tools' },
  { href: '/videos', icon: Video, label: 'Video Library', color: 'from-blue-400 to-blue-600', desc: 'Micro-learning content' },
  { href: '/chatbot', icon: MessageCircle, label: 'Chat Support', color: 'from-emerald-400 to-emerald-600', desc: 'Guided first response' },
  { href: '/booking', icon: Calendar, label: 'Book Counsellor', color: 'from-amber-400 to-amber-500', desc: 'Anonymous 1-to-1 booking' },
  { href: '/safety-plan', icon: Shield, label: 'Safety Plan', color: 'from-rose-400 to-rose-600', desc: 'Personal crisis toolkit' },
]

function GardenVisual({ count }: { count: number }) {
  const plants = Math.min(count, 12)
  return (
    <div className="relative h-24 flex items-end justify-center gap-3 px-4">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-amber-100 to-amber-50 rounded-b-2xl" />

      {Array.from({ length: plants }).map((_, i) => {
        const type = i % 3
        const height = 40 + (i % 4) * 12
        const hue = 120 + (i * 15) % 60
        return (
          <div key={i} className="relative flex items-end" style={{ height }}>
            {type === 0 && (
              <div className="plant-sway" style={{ animationDelay: `${i * 0.3}s` }}>
                <div className="w-4 h-1 bg-amber-700 rounded mx-auto" />
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `hsl(${hue}, 60%, 45%)` }}>
                  <Leaf className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
            {type === 1 && (
              <div className="plant-sway" style={{ animationDelay: `${i * 0.4}s` }}>
                <div className="w-1 bg-amber-700 rounded mx-auto" style={{ height: height - 24 }} />
                <Flower2 className="w-6 h-6 -mt-2" style={{ color: `hsl(${hue + 30}, 70%, 55%)` }} />
              </div>
            )}
            {type === 2 && (
              <div className="plant-sway" style={{ animationDelay: `${i * 0.5}s` }}>
                <TreePine className="w-7 h-7" style={{ color: `hsl(${hue}, 55%, 35%)` }} />
              </div>
            )}
          </div>
        )
      })}

      {plants === 0 && (
        <div className="text-center relative pb-4">
          <span className="text-4xl">🌱</span>
          <p className="text-xs text-gray-400 mt-1">Complete exercises to grow your garden!</p>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('Good day')

  useEffect(() => {
    const hour = new Date().getHours()
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening')
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [userRes, screenerRes, moodRes, completionsRes] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/screener'),
        fetch('/api/mood'),
        fetch('/api/exercises'),
      ])

      const userData = await userRes.json()
      const screenerData = await screenerRes.json()
      const moodData = await moodRes.json()
      const completionsData = await completionsRes.json()

      const logs = moodData.logs || []
      const recentMood = logs.length > 0 ? logs[logs.length - 1].score : 3

      const completions = completionsData.completions || []
      const categories = [...new Set(completions.map((c: { category: string }) => c.category))]

      // Compute badges
      const badges: string[] = []
      if (completions.length >= 1) badges.push('First Step')
      if (completions.length >= 5) badges.push('Explorer')
      if (completions.length >= 10) badges.push('Dedicated')
      if (categories.includes('breathing')) badges.push('Breath Master')
      if (categories.includes('cbt')) badges.push('Reframer')
      if (categories.includes('grounding')) badges.push('Grounded')

      setData({
        name: userData.user?.name || 'Friend',
        tier: screenerData.result?.tier || 'LOW',
        phq9Band: '',
        gad7Band: '',
        recentMood,
        completionCount: completions.length,
        completions: completions.slice(0, 3),
        unlockedBadges: badges,
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-soft">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const moodScore = (data?.recentMood || 3) - 1

  return (
    <div className="app-page min-h-screen pb-24">
      <Navigation name={data?.name} />

      <main className="app-content max-w-4xl mx-auto px-4 pt-4 pb-8">
        {/* Hero greeting */}
        <div className="dashboard-reveal dashboard-hero mb-6 overflow-hidden relative">
          <div className="dashboard-hero-glow dashboard-hero-glow-one" />
          <div className="dashboard-hero-glow dashboard-hero-glow-two" />
          <div className="relative z-10">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
              {greeting.includes('morning') ? <Sun className="w-5 h-5 text-amber-500" />
                : greeting.includes('evening') ? <Moon className="w-5 h-5 text-indigo-500" />
                  : <Cloud className="w-5 h-5 text-blue-400" />}
                <p className="font-semibold text-white/80">{greeting}</p>
              </div>
              <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white/80">Your space today</span>
            </div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-teal-100">A gentle check-in</p>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {data?.name === 'Anonymous' ? 'Welcome back 👋' : `${data?.name} 👋`}
            </h1>
            <p className="mb-6 max-w-xl text-sm leading-6 text-white/75">You can take this one moment at a time. Here&apos;s a quiet place to notice what you need today.</p>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/12 px-4 py-3 backdrop-blur-sm">
                <span className="text-3xl">{MOOD_EMOJIS[moodScore]}</span>
                <div>
                  <p className="text-xs text-white/65">Last mood</p>
                  <p className="font-semibold" style={{ color: MOOD_COLORS[moodScore] }}>
                    {MOOD_LABELS[moodScore]}
                  </p>
                </div>
              </div>
              {data?.tier && (
                <div className={`px-3 py-2 rounded-full text-xs font-semibold ${
                  data.tier === 'HIGH' ? 'tier-high' :
                  data.tier === 'MODERATE' ? 'tier-moderate' : 'tier-low'
                }`}>
                  {data.tier === 'HIGH' ? '🔴' : data.tier === 'MODERATE' ? '🟡' : '🟢'} {data.tier} tier
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daily pause */}
        <section className="dashboard-reveal dashboard-pause glass-card mb-6 overflow-hidden">
          <div className="grid items-stretch sm:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-56 overflow-hidden sm:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85"
                alt="Sunlight across a quiet green landscape"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 dashboard-photo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/35 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-bold text-teal-800 shadow-sm backdrop-blur-sm">
                A moment to reset
              </span>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-7">
              <div className="mb-3 flex items-center gap-2 text-teal-700">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-[0.16em]">Your daily pause</span>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-800">You don&apos;t have to fix everything today.</h2>
              <p className="mb-5 max-w-md text-sm leading-6 text-gray-500">Take one slow breath, notice where you are, and choose the smallest kind next step.</p>
              <Link href="/mood" className="btn-primary w-fit px-4 py-2 text-sm">Check in with yourself <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </section>

        {/* Garden / Gamification */}
        <div className="dashboard-reveal dashboard-garden glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Your Wellness Garden
              </h2>
              <p className="text-sm text-gray-500">{data?.completionCount || 0} exercises completed · keep going!</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-600">{(data?.completionCount || 0) * 10}</p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>

          <GardenVisual count={data?.completionCount || 0} />

          {/* Badges */}
          {(data?.unlockedBadges?.length ?? 0) > 0 && (
            <div className="mt-4 flex gap-2 flex-wrap">
              {data?.unlockedBadges.map(badge => (
                <span key={badge} className="flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200">
                  <Award className="w-3 h-3" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick tiles */}
        <h2 className="dashboard-reveal font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Quick access
        </h2>
        <div className="dashboard-reveal dashboard-quick-grid grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          {tiles.map(tile => {
            const Icon = tile.icon
            return (
              <Link
                key={tile.href}
                href={tile.href}
                id={`tile-${tile.label.toLowerCase().replace(/ /g, '-')}`}
                className="dashboard-tile glass-card p-5 transition-all duration-200 group"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-gray-800 text-sm mb-1">{tile.label}</p>
                <p className="text-xs text-gray-400">{tile.desc}</p>
              </Link>
            )
          })}
        </div>

        {/* Recent activity */}
        {(data?.completions?.length ?? 0) > 0 && (
          <div className="dashboard-reveal glass-card p-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Recent activity
            </h2>
            <div className="space-y-3">
              {data?.completions.map((c, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.exerciseName}</p>
                    <p className="text-xs text-gray-400 capitalize">{c.category} · {new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
