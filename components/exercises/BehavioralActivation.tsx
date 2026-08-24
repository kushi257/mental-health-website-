'use client'

import { useState, useEffect } from 'react'
import { Calendar, Plus, CheckCircle, Smile } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PRESET_ACTIVITIES = [
  'Go for a 15-minute walk outside',
  'Drink a glass of water & stretch',
  'Call or message a close friend',
  'Tidy up one small area of my desk/room',
  'Listen to an uplifting song',
  'Spend 10 mins reading a non-study book',
]

interface Activity {
  id: string
  activityName: string
  scheduledFor: string
  completed: boolean
  createdAt: string
}

export default function BehavioralActivation({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ACTIVITIES[0])
  const [customActivity, setCustomActivity] = useState('')
  const [scheduledFor, setScheduledFor] = useState('Today afternoon')
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      const res = await fetch('/api/journal?type=activation')
      const data = await res.json()
      setActivities(data.entries || [])
    } catch (e) {
      console.error(e)
    }
  }

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    const name = customActivity.trim() || selectedPreset
    if (!name) return

    setLoading(true)
    try {
      await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'activation',
          activityName: name,
          scheduledFor,
        }),
      })
      setCustomActivity('')
      onComplete()
      loadActivities()
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
      loadActivities()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Behavioral Activation Planner</h1>
        <p className="text-gray-500 mt-1">Schedule low-effort activities to break the cycle of low mood</p>
      </div>

      <div className="glass-card p-6 mb-8">
        <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
          <Smile className="w-5 h-5 text-emerald-600" />
          Plan an Uplifting Activity
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          When mood is low, action creates motivation — not the other way around. Pick or type a small positive action.
        </p>

        <form onSubmit={handleSchedule} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Pick a low-effort activity:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {PRESET_ACTIVITIES.map(preset => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => { setSelectedPreset(preset); setCustomActivity('') }}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${selectedPreset === preset && !customActivity ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold' : 'border-gray-200 bg-white text-gray-700'}`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Or add your own custom activity:</label>
            <input
              id="custom-activity-input"
              type="text"
              className="input-field"
              placeholder="e.g. Paint for 15 minutes, cook a fresh meal"
              value={customActivity}
              onChange={e => setCustomActivity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">When will you do it?</label>
            <select
              id="activation-schedule-select"
              className="input-field bg-white"
              value={scheduledFor}
              onChange={e => setScheduledFor(e.target.value)}
            >
              <option value="Today afternoon">Today afternoon</option>
              <option value="Today evening">Today evening</option>
              <option value="Tomorrow morning">Tomorrow morning</option>
              <option value="Tomorrow evening">Tomorrow evening</option>
            </select>
          </div>

          <button id="schedule-activation-btn" type="submit" disabled={loading} className="btn-primary w-full">
            <Plus className="w-4 h-4" /> {loading ? 'Scheduling...' : 'Schedule Activity'}
          </button>
        </form>
      </div>

      {/* Activities list */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">My Planned Activities ({activities.length})</h3>

        {activities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No activities scheduled yet.</p>
        ) : (
          <div className="space-y-3">
            {activities.map(act => (
              <div
                key={act.id}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${act.completed ? 'bg-emerald-50/60 border-emerald-200' : 'bg-white border-gray-200'}`}
              >
                <div>
                  <p className={`text-sm font-semibold ${act.completed ? 'line-through text-emerald-800' : 'text-gray-800'}`}>
                    {act.activityName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-600" /> Scheduled for: {act.scheduledFor}
                  </p>
                </div>

                <button
                  onClick={() => toggleComplete(act.id, act.completed)}
                  className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all ${act.completed ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'}`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {act.completed ? 'Done 🎉' : 'Mark Done'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
