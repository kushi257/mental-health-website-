'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts'
import { Shield, Users, BarChart3, TrendingUp, AlertTriangle, ArrowLeft, Lock } from 'lucide-react'

export default function AdminPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

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

        <Link href="/dashboard" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-4 py-2 rounded-xl transition-all border border-slate-700">
          <ArrowLeft className="w-4 h-4" /> Return to Student App
        </Link>
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
            <p className="text-xs text-slate-400 font-medium">Total Registered Students</p>
            <p className="text-3xl font-bold text-cyan-400 mt-2">{data?.summary?.totalUsers || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Total Mood Check-ins</p>
            <p className="text-3xl font-bold text-emerald-400 mt-2">{data?.summary?.totalMoodLogs || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs text-slate-400 font-medium">Exercise Completions</p>
            <p className="text-3xl font-bold text-indigo-400 mt-2">{data?.summary?.totalCompletions || 0}</p>
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
          <h3 className="font-bold text-white text-sm mb-4">Self-Help Exercise Engagement by Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(data?.exerciseStats || []).map((stat: any) => (
              <div key={stat.category} className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">{stat.category}</p>
                <p className="text-2xl font-bold text-cyan-300 mt-1">{stat.count} completions</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
