'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import MoodChart from '@/components/MoodChart'
import { Plus, Tag, Smile, Frown, Meh, Sparkles, Lock } from 'lucide-react'

const MOOD_OPTIONS = [
  { score: 1, emoji: '😔', label: 'Struggling' },
  { score: 2, emoji: '😕', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😊', label: 'Great' },
]

const TRIGGER_TAGS = ['exams', 'sleep', 'family', 'money', 'relationships', 'workload', 'health', 'social']

export default function MoodPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [selectedScore, setSelectedScore] = useState<number>(3)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<'checkin' | 'trends' | 'recap'>('checkin')

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    try {
      const res = await fetch('/api/mood')
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (e) {
      console.error(e)
    }
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: selectedScore,
          tags: selectedTags,
          note,
        }),
      })

      setNote('')
      setSelectedTags([])
      loadLogs()
      setActiveTab('trends')
    } catch (e) {
      console.error(e)
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate stats for weekly recap
  const recentLogs = logs.slice(-7)
  const avgMood = recentLogs.length > 0
    ? (recentLogs.reduce((sum, l) => sum + l.score, 0) / recentLogs.length).toFixed(1)
    : 'N/A'

  const allTags = recentLogs.flatMap(l => l.tags || [])
  const topTag = allTags.length > 0
    ? Object.entries(allTags.reduce((acc: any, t: string) => { acc[t] = (acc[t] || 0) + 1; return acc }, {}))
        .sort((a: any, b: any) => b[1] - a[1])[0][0]
    : 'None'

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fffe 100%)' }}>
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mood Tracker & Journal</h1>
          <p className="text-gray-500 mt-1">Log how you feel and track your emotional wellness over time</p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 mb-6 p-1 bg-white rounded-xl border border-gray-200">
          {[
            { id: 'checkin', label: 'Log Mood' },
            { id: 'trends', label: 'Mood Trends' },
            { id: 'recap', label: 'Weekly Recap' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === tab.id ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-500 hover:text-teal-700'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Check-in Form */}
        {activeTab === 'checkin' && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">How are you feeling right now?</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Emoji selector */}
              <div className="flex justify-around items-center py-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                {MOOD_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt.score}
                    id={`mood-opt-${opt.score}`}
                    onClick={() => setSelectedScore(opt.score)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <span className={`text-4xl transition-transform ${selectedScore === opt.score ? 'scale-125' : 'opacity-60 group-hover:opacity-100'}`}>
                      {opt.emoji}
                    </span>
                    <span className={`text-xs font-semibold ${selectedScore === opt.score ? 'text-teal-700 font-bold' : 'text-gray-400'}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tag selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">What is influencing your mood?</label>
                <div className="flex flex-wrap gap-2">
                  {TRIGGER_TAGS.map(tag => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all capitalize ${selectedTags.includes(tag) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Add a quick note (optional)</label>
                <textarea
                  id="mood-note-input"
                  rows={2}
                  className="input-field"
                  placeholder="What was on your mind today?"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>

              <button id="save-mood-btn" type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Saving...' : 'Log Mood Check-in'}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Trends Chart */}
        {activeTab === 'trends' && (
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Mood Trajectory</h2>
            <MoodChart logs={logs} />

            <div className="mt-8">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Recent Check-in Logs</h3>
              <div className="space-y-3">
                {logs.slice(-10).reverse().map(l => (
                  <div key={l.id} className="p-3 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{MOOD_OPTIONS.find(m => m.score === l.score)?.emoji || '😐'}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">{l.note || 'No note added'}</p>
                        <div className="flex gap-1 mt-1">
                          {(l.tags || []).map((t: string) => (
                            <span key={t} className="text-[10px] bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded font-mono">#{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(l.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Recap (Private) */}
        {activeTab === 'recap' && (
          <div className="glass-card p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-teal-600" />
              <h2 className="text-lg font-bold text-gray-800">Private Weekly Recap</h2>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              This summary is generated only for you and is strictly private. It is never shared with your college or any institutional dashboard.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-teal-50 rounded-xl text-center">
                <p className="text-xs text-teal-700 font-medium">Avg Mood (7 Days)</p>
                <p className="text-3xl font-bold text-teal-800 mt-1">{avgMood} / 5</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <p className="text-xs text-purple-700 font-medium">Top Trigger Tag</p>
                <p className="text-2xl font-bold text-purple-800 mt-1 capitalize">#{topTag}</p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 text-sm mb-1">Personalized Insight</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                You logged {recentLogs.length} entries over the last week. Keeping up regular check-ins increases emotional self-awareness and helps identify stress triggers early.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
