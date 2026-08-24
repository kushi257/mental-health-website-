'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, Play, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2'
const PHASES: Phase[] = ['inhale', 'hold1', 'exhale', 'hold2']
const PHASE_DURATIONS: Record<Phase, number> = { inhale: 4, hold1: 4, exhale: 4, hold2: 4 }
const PHASE_LABELS: Record<Phase, string> = {
  inhale: 'Inhale', hold1: 'Hold', exhale: 'Exhale', hold2: 'Hold'
}
const PHASE_COLORS: Record<Phase, string> = {
  inhale: '#14b8a6', hold1: '#8b5cf6', exhale: '#3b82f6', hold2: '#f59e0b'
}

export default function BoxBreathing({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [timeLeft, setTimeLeft] = useState(4)
  const [cycles, setCycles] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [boxSize, setBoxSize] = useState(120)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const TARGET_CYCLES = 4

  const stopExercise = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setActive(false)
  }

  const startExercise = () => {
    setPhase('inhale')
    setTimeLeft(4)
    setCycles(0)
    setCompleted(false)
    setActive(true)
  }

  useEffect(() => {
    if (!active) return

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Advance to next phase
          setPhase(currentPhase => {
            const idx = PHASES.indexOf(currentPhase)
            const nextIdx = (idx + 1) % PHASES.length
            const nextPhase = PHASES[nextIdx]
            if (nextIdx === 0) {
              // Completed a full cycle
              setCycles(c => {
                const newCount = c + 1
                if (newCount >= TARGET_CYCLES) {
                  stopExercise()
                  setCompleted(true)
                  onComplete()
                }
                return newCount
              })
            }
            return nextPhase
          })
          return PHASE_DURATIONS[phase]
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [active, phase, onComplete])

  // Animate box size based on phase
  useEffect(() => {
    if (!active) return
    const target = phase === 'inhale' ? 180 : phase === 'hold1' ? 180 : phase === 'exhale' ? 100 : 100
    setBoxSize(target)
  }, [phase, active])

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Box Breathing</h1>
        <p className="text-gray-500 mt-1">4-4-4-4 breathing pattern to calm your nervous system</p>
      </div>

      <div className="glass-card p-8 mb-6">
        {!active && !completed && (
          <div className="text-center">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Box breathing reduces stress by regulating your nervous system. Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4 cycles.
            </p>
            <div className="flex justify-center mb-6">
              {/* Static preview box */}
              <svg width="200" height="200" viewBox="0 0 200 200">
                <rect x="40" y="40" width="120" height="120" fill="none" stroke="#0d9488" strokeWidth="3" strokeDasharray="10" rx="12" />
                {['Inhale →', '↓ Hold', '← Exhale', 'Hold ↑'].map((label, i) => {
                  const positions = [
                    { x: 100, y: 28 }, { x: 178, y: 100 }, { x: 100, y: 172 }, { x: 22, y: 100 }
                  ]
                  return <text key={i} x={positions[i].x} y={positions[i].y} textAnchor="middle" dominantBaseline="middle" fontSize="11" fill="#64748b">{label}</text>
                })}
              </svg>
            </div>
            <button id="start-box-breathing" onClick={startExercise} className="btn-primary">
              <Play className="w-5 h-5" /> Start 4 Cycles
            </button>
          </div>
        )}

        {active && (
          <div className="flex flex-col items-center">
            <p className="text-gray-500 mb-2 font-medium">Cycle {cycles + 1} of {TARGET_CYCLES}</p>

            {/* Animated box */}
            <div className="relative flex items-center justify-center my-6" style={{ width: 220, height: 220 }}>
              <div
                className="rounded-2xl border-4"
                style={{
                  width: boxSize,
                  height: boxSize,
                  borderColor: PHASE_COLORS[phase],
                  background: `${PHASE_COLORS[phase]}20`,
                  transition: 'width 1s ease-in-out, height 1s ease-in-out, border-color 0.5s, background 0.5s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div className="text-center">
                  <p className="text-4xl font-bold" style={{ color: PHASE_COLORS[phase] }}>{timeLeft}</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: PHASE_COLORS[phase] }}>
                    {PHASE_LABELS[phase]}
                  </p>
                </div>
              </div>
            </div>

            {/* Phase indicators */}
            <div className="flex gap-3 mb-6">
              {PHASES.map(p => (
                <div key={p} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full mb-1 transition-all" style={{ background: p === phase ? PHASE_COLORS[p] : '#e2e8f0' }} />
                  <span className="text-xs text-gray-400">{PHASE_LABELS[p]}</span>
                </div>
              ))}
            </div>

            <button onClick={stopExercise} className="btn-secondary">
              <RotateCcw className="w-4 h-4" /> Stop
            </button>
          </div>
        )}

        {completed && (
          <div className="text-center animate-grow-in">
            <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Well done! 🌟</h2>
            <p className="text-gray-500 mb-6">You completed 4 full cycles of box breathing. Your nervous system thanks you!</p>
            <div className="flex gap-3 justify-center">
              <button onClick={startExercise} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Do again
              </button>
              <button onClick={() => router.push('/exercises')} className="btn-primary">
                Back to library
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-700 mb-2">💡 How it helps</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          Box breathing activates the parasympathetic nervous system, counteracting the fight-or-flight response. Used by Navy SEALs and therapists alike, it's one of the fastest ways to reduce acute stress.
        </p>
      </div>
    </div>
  )
}
