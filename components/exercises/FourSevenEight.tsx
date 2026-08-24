'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Play, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Phase478 = 'inhale' | 'hold' | 'exhale' | 'rest'
const DURATIONS: Record<Phase478, number> = { inhale: 4, hold: 7, exhale: 8, rest: 2 }
const LABELS: Record<Phase478, string> = { inhale: 'Inhale through nose', hold: 'Hold breath', exhale: 'Exhale through mouth', rest: 'Rest' }
const COLORS: Record<Phase478, string> = { inhale: '#0d9488', hold: '#8b5cf6', exhale: '#3b82f6', rest: '#94a3b8' }
const SIZES: Record<Phase478, number> = { inhale: 160, hold: 160, exhale: 80, rest: 80 }
const ORDER: Phase478[] = ['inhale', 'hold', 'exhale', 'rest']

export default function FourSevenEight({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<Phase478>('inhale')
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycles, setCycles] = useState(0)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const TARGET = 4

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActive(false)
  }

  const start = () => {
    setPhase('inhale')
    setTimeLeft(DURATIONS.inhale)
    setCycles(0)
    setCompleted(false)
    setActive(true)
  }

  useEffect(() => {
    if (!active) return
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase(cur => {
            const idx = ORDER.indexOf(cur)
            const next = ORDER[(idx + 1) % ORDER.length]
            if (next === 'inhale') {
              setCycles(c => {
                const n = c + 1
                if (n >= TARGET) { stop(); setCompleted(true); onComplete() }
                return n
              })
            }
            return next
          })
          return DURATIONS[phase]
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [active, phase, onComplete])

  const size = SIZES[phase]
  const color = COLORS[phase]
  const pct = timeLeft / DURATIONS[phase]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">4-7-8 Breathing</h1>
        <p className="text-gray-500 mt-1">Dr. Andrew Weil's relaxing breath technique</p>
      </div>

      <div className="glass-card p-8 mb-6">
        {!active && !completed && (
          <div className="text-center">
            <div className="flex justify-center gap-6 mb-6">
              {[['4', 'Inhale', '#0d9488'], ['7', 'Hold', '#8b5cf6'], ['8', 'Exhale', '#3b82f6']].map(([num, label, color]) => (
                <div key={label} className="text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2" style={{ background: color as string }}>
                    {num}
                  </div>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Inhale quietly for 4 counts, hold for 7, exhale completely for 8. The extended exhale engages your parasympathetic system and helps you relax deeply.
            </p>
            <button id="start-478" onClick={start} className="btn-primary">
              <Play className="w-5 h-5" /> Begin (4 cycles)
            </button>
          </div>
        )}

        {active && (
          <div className="flex flex-col items-center">
            <p className="text-gray-500 mb-4 font-medium">Cycle {cycles + 1} of {TARGET}</p>

            {/* Animated circle */}
            <div className="relative flex items-center justify-center my-4" style={{ width: 220, height: 220 }}>
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: size,
                  height: size,
                  background: `${color}20`,
                  border: `4px solid ${color}`,
                  transition: `width ${DURATIONS[phase]}s ease-in-out, height ${DURATIONS[phase]}s ease-in-out`,
                }}
              >
                <div className="text-center">
                  <p className="text-5xl font-bold" style={{ color }}>{timeLeft}</p>
                </div>
              </div>
            </div>

            <p className="text-lg font-semibold mb-1" style={{ color }}>{LABELS[phase]}</p>
            <p className="text-sm text-gray-400 mb-6">
              {phase === 'inhale' ? '👃 through your nose' :
                phase === 'hold' ? '🤐 hold gently' :
                  phase === 'exhale' ? '👄 through your mouth, make a whoosh sound' : '🔄 preparing next cycle'}
            </p>

            <button onClick={stop} className="btn-secondary">
              <RotateCcw className="w-4 h-4" /> Stop
            </button>
          </div>
        )}

        {completed && (
          <div className="text-center animate-grow-in">
            <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Beautifully done 🌙</h2>
            <p className="text-gray-500 mb-6">4-7-8 breathing is especially powerful for sleep and relaxation. Practice daily for best results.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={start} className="btn-secondary"><RotateCcw className="w-4 h-4" /> Again</button>
              <button onClick={() => router.push('/exercises')} className="btn-primary">Back to library</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
