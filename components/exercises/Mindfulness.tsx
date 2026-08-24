'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, CheckCircle, Volume2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const TRACKS = [
  { duration: 5, label: '5 Min Quick Reset', desc: 'Short breathing space to recenter during busy days' },
  { duration: 10, label: '10 Min Body & Breath', desc: 'Full body awareness and breath observation' },
  { duration: 15, label: '15 Min Deep Peace', desc: 'Extended mindfulness session for deep calm & clarity' },
]

export default function Mindfulness({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [selectedTrack, setSelectedTrack] = useState(TRACKS[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(5 * 60)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSeconds = selectedTrack.duration * 60

  const handleSelectTrack = (track: typeof TRACKS[0]) => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setIsPlaying(false)
    }
    setSelectedTrack(track)
    setSecondsLeft(track.duration * 60)
    setCompleted(false)
  }

  const togglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsPlaying(false)
    setSecondsLeft(selectedTrack.duration * 60)
    setCompleted(false)
  }

  useEffect(() => {
    if (!isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setIsPlaying(false)
          setCompleted(true)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, onComplete])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const progressPct = ((totalSeconds - secondsLeft) / totalSeconds) * 100

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mindfulness Meditation</h1>
        <p className="text-gray-500 mt-1">Guided meditation tracks to anchor your mind</p>
      </div>

      {/* Track options */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {TRACKS.map(track => (
          <button
            key={track.duration}
            onClick={() => handleSelectTrack(track)}
            className="glass-card p-4 text-center border-2 transition-all"
            style={{
              borderColor: selectedTrack.duration === track.duration ? '#0d9488' : 'transparent',
              background: selectedTrack.duration === track.duration ? '#f0fdfa' : 'rgba(255,255,255,0.85)',
            }}
          >
            <span className="text-xl font-bold text-teal-700 block">{track.duration}m</span>
            <span className="text-xs text-gray-500 block mt-1 font-medium">{track.label}</span>
          </button>
        ))}
      </div>

      <div className="glass-card p-8 mb-6 text-center">
        {completed ? (
          <div className="animate-grow-in">
            <CheckCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Meditation complete 🧘</h2>
            <p className="text-gray-500 mb-6">You completed your {selectedTrack.duration}-minute mindfulness session.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={reset} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Repeat</button>
              <button onClick={() => router.push('/exercises')} className="btn-primary">Library</button>
            </div>
          </div>
        ) : (
          <div>
            <div className="w-32 h-32 rounded-full bg-amber-50 border-4 border-amber-300 flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden">
              <div
                className="absolute inset-0 bg-amber-200/50 transition-all duration-1000"
                style={{ top: `${100 - progressPct}%` }}
              />
              <div className="relative z-10">
                <span className="text-3xl font-bold text-amber-800">{formatTime(secondsLeft)}</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-1">{selectedTrack.label}</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">{selectedTrack.desc}</p>

            {/* Audio visualization mock */}
            <div className="flex items-center justify-center gap-1.5 h-8 mb-6">
              {[40, 70, 30, 90, 60, 80, 50, 95, 35, 65, 85, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-amber-400 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(15, (h * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}%` : '20%',
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <button onClick={reset} className="btn-secondary p-3 rounded-full">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button onClick={togglePlay} id="mindfulness-play" className="btn-primary px-8 py-3 rounded-full text-lg">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
