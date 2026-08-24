'use client'

import { useState } from 'react'
import { CheckCircle, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const STEPS = [
  { sense: 'Sight 👁️', count: 5, prompt: 'Name 5 things you can see right now', placeholder: 'e.g. my desk, a window, my hands, a plant, a pen' },
  { sense: 'Touch 🤌', count: 4, prompt: 'Name 4 things you can physically feel', placeholder: 'e.g. my feet on the floor, the chair under me, the air, my clothes' },
  { sense: 'Sound 👂', count: 3, prompt: 'Name 3 things you can hear right now', placeholder: 'e.g. fans humming, distant traffic, birds chirping' },
  { sense: 'Smell 👃', count: 2, prompt: 'Name 2 things you can smell (or like the smell of)', placeholder: 'e.g. fresh air, coffee, a candle' },
  { sense: 'Taste 👅', count: 1, prompt: 'Name 1 thing you can taste right now', placeholder: 'e.g. the aftertaste of water, mint, nothing at all' },
]

export default function Grounding54321({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [step, setStep] = useState(-1) // -1 = intro
  const [inputs, setInputs] = useState<string[]>(STEPS.map(() => ''))
  const [completed, setCompleted] = useState(false)

  const handleNext = () => {
    if (step === STEPS.length - 1) {
      setCompleted(true)
      onComplete()
    } else {
      setStep(s => s + 1)
    }
  }

  if (step === -1) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">5-4-3-2-1 Grounding</h1>
          <p className="text-gray-500 mt-1">Use your 5 senses to anchor yourself in the present</p>
        </div>
        <div className="glass-card p-8 text-center">
          <span className="text-6xl mb-4 block">🌿</span>
          <p className="text-gray-600 mb-6 leading-relaxed">
            This technique quickly interrupts anxious or overwhelming thoughts by shifting your focus to your physical senses. Work through each sense from 5 down to 1.
          </p>
          <div className="flex justify-center gap-4 mb-8">
            {STEPS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mx-auto mb-1">
                  {s.count}
                </div>
                <p className="text-xs text-gray-400">{s.sense.split(' ')[1]}</p>
              </div>
            ))}
          </div>
          <button id="start-grounding" onClick={() => setStep(0)} className="btn-primary">
            Let&apos;s begin
          </button>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">5-4-3-2-1 Grounding</h1>
        </div>
        <div className="glass-card p-8 text-center animate-grow-in">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">You did it! 🌿</h2>
          <p className="text-gray-500 mb-6">You've anchored yourself in the present moment. Notice if you feel a little more grounded now.</p>
          <div className="space-y-2 text-left mb-6 p-4 bg-emerald-50 rounded-2xl">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-emerald-600 font-bold">{s.count}:</span>
                <span className="text-gray-600">{inputs[i]}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setStep(-1); setInputs(STEPS.map(() => '')); setCompleted(false) }} className="btn-secondary">
              Try again
            </button>
            <button onClick={() => router.push('/exercises')} className="btn-primary">Library</button>
          </div>
        </div>
      </div>
    )
  }

  const current = STEPS[step]
  const progressPct = ((step) / STEPS.length) * 100

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">5-4-3-2-1 Grounding</h1>
      </div>

      {/* Step progress */}
      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-full transition-all"
            style={{ background: i <= step ? '#10b981' : '#e2e8f0' }}
          />
        ))}
      </div>

      <div className="glass-card p-8 animate-slide-up" key={step}>
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{current.sense.split(' ')[1]}</div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-lg mb-4">
            {current.count} {current.sense.split(' ')[0]}
          </div>
          <p className="text-gray-700 font-medium">{current.prompt}</p>
        </div>

        <textarea
          id={`grounding-input-${step}`}
          className="input-field"
          rows={3}
          placeholder={current.placeholder}
          value={inputs[step]}
          onChange={e => {
            const updated = [...inputs]
            updated[step] = e.target.value
            setInputs(updated)
          }}
        />

        <button
          id="grounding-next"
          onClick={handleNext}
          className="btn-primary w-full mt-4"
        >
          {step === STEPS.length - 1 ? 'Complete ✓' : 'Next sense'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Step {step + 1} of {STEPS.length} · {current.sense}
      </p>
    </div>
  )
}
