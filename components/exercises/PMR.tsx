'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, Volume2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const MUSCLE_GROUPS = [
  { name: 'Hands & Forearms', instruction: 'Make a tight fist with both hands. Hold for 5 seconds, then release completely.', duration: 15 },
  { name: 'Upper Arms & Biceps', instruction: 'Bend your elbows and flex your biceps tightly. Feel the tension, then let go.', duration: 15 },
  { name: 'Shoulders', instruction: 'Raise your shoulders up to your ears. Shrug hard. Hold... then drop them completely.', duration: 15 },
  { name: 'Neck', instruction: 'Gently tilt your head back and press it down lightly. Feel the tension in your neck and release.', duration: 15 },
  { name: 'Face', instruction: 'Scrunch up your entire face — eyes, nose, forehead, cheeks. Squeeze tight... and release.', duration: 15 },
  { name: 'Chest & Lungs', instruction: 'Take a deep breath in and hold it, tensing your chest muscles. Then exhale fully.', duration: 15 },
  { name: 'Stomach & Abdomen', instruction: 'Tighten your stomach muscles as if bracing for a punch. Feel it... then release.', duration: 15 },
  { name: 'Hips & Thighs', instruction: 'Squeeze your legs together and tighten your thigh muscles. Hold... then relax completely.', duration: 15 },
  { name: 'Calves & Feet', instruction: 'Curl your toes downward and tense your calf muscles. Hold... then release everything.', duration: 15 },
]

export default function PMR({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentGroup, setCurrentGroup] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [completed, setCompleted] = useState(false)
  const [progress, setProgress] = useState(0) // 0-100 overall
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalDuration = MUSCLE_GROUPS.reduce((s, g) => s + g.duration, 0)

  const togglePlay = () => setPlaying(p => !p)

  const restart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCurrentGroup(0)
    setTimeLeft(15)
    setProgress(0)
    setCompleted(false)
    setPlaying(false)
    setStarted(false)
  }

  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCurrentGroup(g => {
            if (g >= MUSCLE_GROUPS.length - 1) {
              setPlaying(false)
              setCompleted(true)
              onComplete()
              return g
            }
            return g + 1
          })
          return MUSCLE_GROUPS[Math.min(currentGroup + 1, MUSCLE_GROUPS.length - 1)].duration
        }
        return prev - 1
      })

      // Update overall progress
      setProgress(prev => {
        const elapsed = MUSCLE_GROUPS.slice(0, currentGroup).reduce((s, g) => s + g.duration, 0)
          + (MUSCLE_GROUPS[currentGroup].duration - timeLeft + 1)
        return Math.min(100, (elapsed / totalDuration) * 100)
      })
    }, 1000)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [playing, currentGroup, timeLeft, totalDuration, onComplete])

  if (!started) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Progressive Muscle Relaxation</h1>
          <p className="text-gray-500 mt-1">Tense and release each muscle group to melt away tension</p>
        </div>
        <div className="glass-card p-8 text-center">
          <div className="w-20 h-20 bg-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💆</span>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">
            PMR systematically works through 9 muscle groups. For each one, you'll tense the muscle for 5 seconds, then release for 10 seconds — noticing the contrast between tension and relaxation.
          </p>
          <p className="text-sm text-violet-600 font-medium mb-6 bg-violet-50 p-3 rounded-xl">
            🕐 About 10 minutes · Find a comfortable seated or lying position
          </p>
          <button id="start-pmr" onClick={() => { setStarted(true); setPlaying(true) }} className="btn-primary">
            <Play className="w-5 h-5" /> Begin PMR Session
          </button>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Progressive Muscle Relaxation</h1>
        </div>
        <div className="glass-card p-8 text-center animate-grow-in">
          <CheckCircle className="w-16 h-16 text-violet-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Full body released 🌊</h2>
          <p className="text-gray-500 mb-6">You've completed a full PMR session. Notice how different your body feels — that's the power of systematic relaxation.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={restart} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Restart</button>
            <button onClick={() => router.push('/exercises')} className="btn-primary">Library</button>
          </div>
        </div>
      </div>
    )
  }

  const group = MUSCLE_GROUPS[currentGroup]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Progressive Muscle Relaxation</h1>
      </div>

      <div className="glass-card p-8 mb-4">
        {/* Overall progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Group {currentGroup + 1} of {MUSCLE_GROUPS.length}</span>
            <span className="text-violet-600 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} className="h-full rounded-full transition-all duration-1000" />
          </div>
        </div>

        {/* Current group */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-violet-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💪</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h2>
          <p className="text-gray-600 leading-relaxed">{group.instruction}</p>
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-violet-200 flex flex-col items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7c3aed20, #a78bfa20)' }}>
            <span className="text-4xl font-bold text-violet-700">{timeLeft}</span>
            <span className="text-xs text-violet-500">seconds</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 justify-center">
          <button onClick={togglePlay} id="pmr-play-pause" className="btn-primary">
            {playing ? <><Pause className="w-5 h-5" /> Pause</> : <><Play className="w-5 h-5" /> Resume</>}
          </button>
          <button onClick={restart} className="btn-secondary">
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      </div>

      {/* Group list */}
      <div className="glass-card p-5">
        <div className="space-y-2">
          {MUSCLE_GROUPS.map((g, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < currentGroup ? 'bg-violet-500 text-white' :
                i === currentGroup ? 'bg-violet-200 text-violet-700 border-2 border-violet-500' :
                'bg-gray-100 text-gray-400'
              }`}>
                {i < currentGroup ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${i === currentGroup ? 'font-semibold text-violet-700' : i < currentGroup ? 'text-gray-400' : 'text-gray-600'}`}>
                {g.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
