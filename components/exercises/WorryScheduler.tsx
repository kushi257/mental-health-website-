'use client'

import { useState, useEffect } from 'react'
import { Clock, Plus, CheckCircle, Calendar, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Worry {
  id: string
  worryText: string
  deferredTo: string
  completed: boolean
  createdAt: string
}

export default function WorryScheduler({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [worryText, setWorryText] = useState('')
  const [deferredTo, setDeferredTo] = useState('Today 5:00 PM')
  const [worries, setWorries] = useState<Worry[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadWorries()
  }, [])

  const loadWorries = async () => {
    try {
      const res = await fetch('/api/journal?type=worry')
      const data = await res.json()
      setWorries(data.entries || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleAddWorry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!worryText.trim()) return

    setLoading(true)
    try {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'worry',
          worryText,
          deferredTo,
        }),
      })
      setWorryText('')
      onComplete()
      loadWorries()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const toggleComplete = async (id: string, currentCompleted: boolean) => {
    try {
      await fetch('/api/journal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !currentCompleted }),
      })
      loadWorries()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Worry Scheduler</h1>
        <p className="text-gray-500 mt-1">Postpone current worries to a dedicated &ldquo;worry time&rdquo;</p>
      </div>

      {/* Input form */}
      <div className="glass-card p-6 mb-8">
        <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-teal-600" />
          Park a Worry
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Writing down worries tells your brain: &ldquo;I will deal with this later.&rdquo;
        </p>

        <form onSubmit={handleAddWorry} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">What is troubling you right now?</label>
            <input
              id="worry-text-input"
              type="text"
              className="input-field"
              placeholder="e.g. What if I am not prepared enough for tomorrow's presentation?"
              value={worryText}
              onChange={e => setWorryText(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Schedule worry time for:</label>
            <select
              id="worry-time-select"
              className="input-field bg-white"
              value={deferredTo}
              onChange={e => setDeferredTo(e.target.value)}
            >
              <option value="Today 5:00 PM">Today 5:00 PM (15 mins)</option>
              <option value="Today 8:00 PM">Today 8:00 PM (15 mins)</option>
              <option value="Tomorrow 6:00 PM">Tomorrow 6:00 PM (15 mins)</option>
              <option value="Weekend Worry Time">Weekend Worry Time</option>
            </select>
          </div>

          <button id="schedule-worry-btn" type="submit" disabled={loading} className="btn-primary w-full">
            <Plus className="w-4 h-4" /> {loading ? 'Scheduling...' : 'Park Worry'}
          </button>
        </form>
      </div>

      {/* Scheduled Worries list */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center justify-between">
          <span>Scheduled Worries ({worries.length})</span>
          <span className="text-xs text-teal-600 font-normal">Real-time DB sync</span>
        </h3>

        {worries.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No worries parked right now. Enjoy your peaceful mind!</p>
        ) : (
          <div className="space-y-3">
            {worries.map(w => (
              <div
                key={w.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${w.completed ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-teal-100 shadow-sm'}`}
              >
                <div>
                  <p className={`text-sm font-medium ${w.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                    {w.worryText}
                  </p>
                  <p className="text-xs text-teal-600 font-semibold mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Deferred to: {w.deferredTo}
                  </p>
                </div>

                <button
                  onClick={() => toggleComplete(w.id, w.completed)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${w.completed ? 'bg-gray-200 text-gray-700' : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {w.completed ? 'Resolved' : 'Mark Resolved'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
