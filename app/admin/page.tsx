'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { Shield, BarChart3, TrendingUp, Lock, LogOut, Lightbulb, ArrowUpRight, AlertTriangle, Minus } from 'lucide-react'

interface AdminAnalytics {
  moodTrend: Array<{ date: string; avgMood: number; count: number }>
  exerciseStats: Array<{ category: string; count: number; shareOfActivity: number }>
  exerciseEngagement: {
    activeStudents: number
    participationRate: number
    repeatUsers: number
    repeatUseRate: number
    averageCompletionsPerParticipant: number
  }
  tierDistribution: { LOW: number; MODERATE: number; HIGH: number }
  summary: {
    totalUsers: number
    totalMoodLogs: number
    totalCompletions: number
    totalBookings: number
    screenedStudents: number
  }
  insights: Array<{
    type: 'attention' | 'positive' | 'neutral'
    title: string
    detail: string
    action: string
  }>
}

export default function AdminPage() {
  const router = useRouter()
  const [data, setData] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin')
      .then(r => {
        if (r.status === 401) {
          router.push('/admin/login')
          throw new Error('Admin authentication required')
        }
        return r
      })
      .then(r => r.json() as Promise<AdminAnalytics>)
      .then(analytics => setData(analytics))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400">Loading aggregate analytics...</p>
        </div>
      </div>
    )
  }

  const tierData = [
    { tier: 'Low Risk', count: data?.tierDistribution?.LOW || 0, fill: '#10b981' },
    { tier: 'Moderate Risk', count: data?.tierDistribution?.MODERATE || 0, fill: '#f59e0b' },
    { tier: 'High Risk', count: data?.tierDistribution?.HIGH || 0, fill: '#ef4444' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      {/* Header Bar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between pb-6 border-b border-slate-800 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-600/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-wide">ManoMitra Institutional Portal</h1>
              <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] px-2.5 py-0.5 rounded-full font-mono uppercase">
                ADMIN ACCESS ONLY
              </span>
            </div>
            <p className="text-xs text-slate-400">Aggregated campus wellbeing analytics · No PII exposed</p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl transition-all border border-slate-700">
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </header>

      <main className="max-w-6xl mx-auto space-y-8">
        {/* Compliance Banner */}
        <div className="bg-cyan-950/60 border border-cyan-800/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-cyan-200">
          <Lock className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span>
            <strong>Privacy Enforcement:</strong> All queries on this portal execute strictly at the aggregate database level. Individual user records, names, or raw entries are never retrieved or rendered.
          </span>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Total Number of logins</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">{data?.summary?.totalUsers || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Total Mood Check-ins</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{data?.summary?.totalMoodLogs || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Students Screened</p>
            <p className="text-3xl font-bold text-indigo-400 mt-2">{data?.summary?.screenedStudents || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Counsellor Bookings</p>
            <p className="text-3xl font-bold text-amber-400 mt-2">{data?.summary?.totalBookings || 0}</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Mood Trend */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Campus Average Mood Trajectory
            </h3>
            <p className="text-xs text-slate-400 mb-6">Aggregated daily mean score (1-5 scale)</p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.moodTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[1, 5]} stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
                  <Line type="monotone" dataKey="avgMood" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Tier Distribution */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <h3 className="font-bold text-white text-sm mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              Risk Tier Breakdown (PHQ-9 / GAD-7)
            </h3>
            <p className="text-xs text-slate-400 mb-6">Distribution across screened student population</p>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tierData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="tier" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Exercise Engagement Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex flex-col gap-2 border-b border-slate-800 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-bold text-white text-sm">Student Exercise Participation</h3>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400">Shows how widely students use the tools and whether engagement continues, rather than only counting every completion event.</p>
            </div>
            <span className="w-fit rounded-full border border-indigo-800 bg-indigo-950/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">Population view</span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-indigo-900/70 bg-indigo-950/30 p-4">
              <p className="text-xs text-slate-400">Students using exercises</p>
              <p className="mt-1 text-2xl font-bold text-indigo-300">{data?.exerciseEngagement.activeStudents || 0}</p>
              <p className="mt-1 text-xs text-slate-500">{data?.exerciseEngagement.participationRate || 0}% of registered students</p>
            </div>
            <div className="rounded-xl border border-emerald-900/70 bg-emerald-950/20 p-4">
              <p className="text-xs text-slate-400">Repeat engagement</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">{data?.exerciseEngagement.repeatUseRate || 0}%</p>
              <p className="mt-1 text-xs text-slate-500">{data?.exerciseEngagement.repeatUsers || 0} students completed 2+ exercises</p>
            </div>
            <div className="rounded-xl border border-cyan-900/70 bg-cyan-950/20 p-4">
              <p className="text-xs text-slate-400">Average per participating student</p>
              <p className="mt-1 text-2xl font-bold text-cyan-300">{data?.exerciseEngagement.averageCompletionsPerParticipant || 0}</p>
              <p className="mt-1 text-xs text-slate-500">completion events per exercise user</p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
              <span>Category share of exercise activity</span>
              <span>Share</span>
            </div>
            <div className="space-y-4">
            {(data?.exerciseStats || []).map(stat => (
              <div key={stat.category}>
                <div className="mb-1 flex items-center justify-between gap-4 text-sm">
                  <span className="font-semibold capitalize text-slate-200">{stat.category}</span>
                  <span className="text-slate-400">{stat.shareOfActivity}% <span className="text-xs">({stat.count} activities)</span></span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${stat.shareOfActivity}%` }} />
                </div>
              </div>
            ))}
            {!data?.exerciseStats.length && <p className="rounded-xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">No exercise participation has been recorded yet.</p>}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-6 text-slate-300">
            <strong className="text-white">Interpretation:</strong> A high participation rate means the tools are reaching students; a high repeat-use rate suggests they are returning to use them. Category shares show where demand is concentrated, but do not represent unique students because one student may use multiple categories.
          </div>
        </div>

        {/* Automatic Institutional Readout */}
        <section className="border border-cyan-900/70 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 p-6 rounded-2xl">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-300">
                <Lightbulb className="h-5 w-5" />
                <p className="text-xs font-bold uppercase tracking-[0.18em]">Automatic institutional readout</p>
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">What the aggregate data suggests</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">These conclusions are generated from campus-level signals and are intended to guide planning, not diagnose or identify individual students.</p>
            </div>
            <span className="w-fit rounded-full border border-cyan-800 bg-cyan-950/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">Decision support</span>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {(data?.insights || []).map((insight) => {
              const Icon = insight.type === 'attention' ? AlertTriangle : insight.type === 'positive' ? ArrowUpRight : Minus
              const tone = insight.type === 'attention'
                ? 'border-amber-900/70 bg-amber-950/25 text-amber-300'
                : insight.type === 'positive'
                  ? 'border-emerald-900/70 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-700 bg-slate-950/60 text-slate-300'
              return (
                <article key={insight.title} className={`rounded-xl border p-5 ${tone}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <h3 className="font-bold text-white">{insight.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{insight.detail}</p>
                      <p className="mt-3 border-t border-white/10 pt-3 text-xs font-semibold leading-5 text-slate-400"><span className="text-slate-200">Suggested response:</span> {insight.action}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
