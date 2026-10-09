'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Wind, Zap, Music, Hand, Brain, AlertCircle, Calendar, CheckCircle, Clock } from 'lucide-react'

const exercises = [
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    category: 'breathing',
    icon: '🌬️',
    color: 'from-cyan-400 to-blue-500',
    desc: 'Calm your nervous system with a 4-count breathing pattern',
    duration: '5 min',
    tag: 'Stress & Anxiety',
  },
  {
    id: '478-breathing',
    name: '4-7-8 Breathing',
    category: 'breathing',
    icon: '💨',
    color: 'from-sky-400 to-indigo-500',
    desc: 'Deeply relaxing breath pattern. Inhale 4, hold 7, exhale 8.',
    duration: '5 min',
    tag: 'Sleep & Relaxation',
  },
  {
    id: 'pmr',
    name: 'Progressive Muscle Relaxation',
    category: 'relaxation',
    icon: '💪',
    color: 'from-violet-400 to-purple-600',
    desc: 'Tense and release each muscle group to release body tension',
    duration: '10 min',
    tag: 'Body Tension',
  },
  {
    id: 'grounding-54321',
    name: '5-4-3-2-1 Grounding',
    category: 'grounding',
    icon: '🌿',
    color: 'from-emerald-400 to-teal-600',
    desc: 'Use your 5 senses to anchor yourself in the present moment',
    duration: '5 min',
    tag: 'Anxiety & Panic',
  },
  {
    id: 'mindfulness',
    name: 'Mindfulness Meditation',
    category: 'meditation',
    icon: '🧘',
    color: 'from-amber-400 to-orange-500',
    desc: 'Guided meditation tracks in 3 durations to suit your schedule',
    duration: '5/10/15 min',
    tag: 'Focus & Peace',
  },
  {
    id: 'thought-record',
    name: 'CBT Thought Record',
    category: 'cbt',
    icon: '📝',
    color: 'from-rose-400 to-pink-600',
    desc: 'Identify and reframe unhelpful thought patterns',
    duration: '10 min',
    tag: 'Negative Thoughts',
  },
  {
    id: 'distortion-spotter',
    name: 'Cognitive Distortion Spotter',
    category: 'cbt',
    icon: '🔍',
    color: 'from-fuchsia-400 to-violet-600',
    desc: 'Learn to spot thinking traps through interactive scenarios',
    duration: '5 min',
    tag: 'Thinking Patterns',
  },
  {
    id: 'worry-scheduler',
    name: 'Worry Scheduler',
    category: 'planning',
    icon: '⏰',
    color: 'from-teal-400 to-cyan-600',
    desc: 'Defer worries to a dedicated "worry time" and free your mind',
    duration: '5 min',
    tag: 'Chronic Worry',
  },
  {
    id: 'behavioral-activation',
    name: 'Behavioral Activation',
    category: 'planning',
    icon: '📅',
    color: 'from-green-400 to-emerald-600',
    desc: 'Schedule small, meaningful activities to lift your mood',
    duration: '5 min',
    tag: 'Low Mood',
  },
]

export default function ExercisesPage() {
  const [completions, setCompletions] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetch('/api/exercises')
      .then(r => r.json())
      .then(data => {
        const done = new Set<string>((data.completions || []).map((c: { exerciseId: string }) => c.exerciseId))
        setCompletions(done)
      })
      .catch(() => {})
  }, [])

  const categories = ['all', 'breathing', 'relaxation', 'grounding', 'meditation', 'cbt', 'planning']
  const filtered = filter === 'all' ? exercises : exercises.filter(e => e.category === filter)

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #faf5ff 0%, #f8fffe 100%)' }}>
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 pt-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Self-Help Library</h1>
          <p className="text-gray-500">Evidence-based exercises to support your wellbeing</p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              id={`filter-${cat}`}
              onClick={() => setFilter(cat)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 capitalize flex-shrink-0"
              style={{
                background: filter === cat ? '#0d9488' : 'white',
                color: filter === cat ? 'white' : '#64748b',
                border: filter === cat ? 'none' : '1px solid #e2e8f0',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-teal-50 rounded-2xl">
          <CheckCircle className="w-5 h-5 text-teal-600" />
          <span className="text-teal-700 font-medium text-sm">
            {completions.size} of {exercises.length} exercises tried
          </span>
          <div className="flex-1 progress-bar">
            <div className="progress-fill" style={{ width: `${(completions.size / exercises.length) * 100}%` }} />
          </div>
          <span className="text-teal-600 font-bold text-sm">{Math.round((completions.size / exercises.length) * 100)}%</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(ex => (
            <Link
              key={ex.id}
              href={`/exercises/${ex.id}`}
              id={`exercise-card-${ex.id}`}
              className="glass-card p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
              {completions.has(ex.id) && (
                <div className="absolute top-3 right-3 bg-teal-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ex.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <span className="text-2xl">{ex.icon}</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{ex.name}</h3>
              <p className="text-sm text-gray-500 mb-3 leading-relaxed">{ex.desc}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <Clock className="w-3 h-3" /> {ex.duration}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{ex.tag}</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
