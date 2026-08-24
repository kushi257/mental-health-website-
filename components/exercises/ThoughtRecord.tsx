'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Save, BookOpen, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Entry {
  id: string
  situation: string
  automaticThought: string
  evidenceFor: string
  evidenceAgainst: string
  alternativeView: string
  createdAt: string
}

export default function ThoughtRecord({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [situation, setSituation] = useState('')
  const [automaticThought, setAutomaticThought] = useState('')
  const [evidenceFor, setEvidenceFor] = useState('')
  const [evidenceAgainst, setEvidenceAgainst] = useState('')
  const [alternativeView, setAlternativeView] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pastEntries, setPastEntries] = useState<Entry[]>([])

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const res = await fetch('/api/journal?type=thought_record')
      const data = await res.json()
      setPastEntries(data.entries || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!situation.trim() || !automaticThought.trim() || !alternativeView.trim()) return

    setSaving(true)
    try {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'thought_record',
          situation,
          automaticThought,
          evidenceFor,
          evidenceAgainst,
          alternativeView,
        }),
      })
      setSaved(true)
      onComplete()
      loadEntries()
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSituation('')
    setAutomaticThought('')
    setEvidenceFor('')
    setEvidenceAgainst('')
    setAlternativeView('')
    setSaved(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">CBT Thought Record</h1>
        <p className="text-gray-500 mt-1">Examine and reframe automatic negative thoughts</p>
      </div>

      <div className="glass-card p-6 mb-8">
        {saved ? (
          <div className="text-center py-6 animate-grow-in">
            <CheckCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Thought Reframed! 📝</h2>
            <p className="text-gray-500 mb-6">Your entry has been saved to your journal.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="btn-secondary">
                <Plus className="w-4 h-4" /> New Record
              </button>
              <button onClick={() => router.push('/exercises')} className="btn-primary">
                Back to Library
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                1. Situation / Trigger
              </label>
              <p className="text-xs text-gray-400 mb-2">What happened? Where were you? Who were you with?</p>
              <input
                id="cbt-situation"
                type="text"
                className="input-field"
                placeholder="e.g., Got a low grade on my assignment"
                value={situation}
                onChange={e => setSituation(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                2. Automatic Negative Thought
              </label>
              <p className="text-xs text-gray-400 mb-2">What went through your mind? What are you telling yourself?</p>
              <input
                id="cbt-thought"
                type="text"
                className="input-field"
                placeholder="e.g., I'm going to fail the whole course and ruin my future"
                value={automaticThought}
                onChange={e => setAutomaticThought(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  3. Evidence FOR the thought
                </label>
                <textarea
                  id="cbt-evidence-for"
                  className="input-field"
                  rows={3}
                  placeholder="Facts that support this thought..."
                  value={evidenceFor}
                  onChange={e => setEvidenceFor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  4. Evidence AGAINST the thought
                </label>
                <textarea
                  id="cbt-evidence-against"
                  className="input-field"
                  rows={3}
                  placeholder="Facts that contradict or challenge it..."
                  value={evidenceAgainst}
                  onChange={e => setEvidenceAgainst(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                5. Alternative / Balanced Perspective
              </label>
              <p className="text-xs text-gray-400 mb-2">Considering both sides, what is a fairer, more realistic view?</p>
              <textarea
                id="cbt-alternative"
                className="input-field"
                rows={3}
                placeholder="e.g., One bad grade is disappointing, but I can ask the professor for feedback and improve next time."
                value={alternativeView}
                onChange={e => setAlternativeView(e.target.value)}
                required
              />
            </div>

            <button id="save-thought-record" type="submit" disabled={saving} className="btn-primary w-full">
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Thought Record'}
            </button>
          </form>
        )}
      </div>

      {/* Past Entries List */}
      {pastEntries.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            Previous Reframed Thoughts
          </h3>
          <div className="space-y-4">
            {pastEntries.map(entry => (
              <div key={entry.id} className="p-4 bg-white/60 border border-gray-100 rounded-xl space-y-2">
                <div className="flex justify-between items-start text-xs text-gray-400">
                  <span className="font-medium text-gray-600">Trigger: {entry.situation}</span>
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm">
                  <p className="text-red-700 font-medium line-through opacity-75">
                    Thought: &ldquo;{entry.automaticThought}&rdquo;
                  </p>
                  <p className="text-teal-800 font-semibold mt-1">
                    Reframed: &ldquo;{entry.alternativeView}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
