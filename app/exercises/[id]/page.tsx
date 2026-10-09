'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import Navigation from '@/components/Navigation'
import BoxBreathing from '@/components/exercises/BoxBreathing'
import FourSevenEight from '@/components/exercises/FourSevenEight'
import PMR from '@/components/exercises/PMR'
import Grounding54321 from '@/components/exercises/Grounding54321'
import Mindfulness from '@/components/exercises/Mindfulness'
import ThoughtRecord from '@/components/exercises/ThoughtRecord'
import DistortionSpotter from '@/components/exercises/DistortionSpotter'
import WorryScheduler from '@/components/exercises/WorryScheduler'
import BehavioralActivation from '@/components/exercises/BehavioralActivation'

const EXERCISE_MAP: Record<string, { component: React.ComponentType<{ onComplete: () => void }>; name: string; category: string }> = {
  'box-breathing': { component: BoxBreathing, name: 'Box Breathing', category: 'breathing' },
  '478-breathing': { component: FourSevenEight, name: '4-7-8 Breathing', category: 'breathing' },
  'pmr': { component: PMR, name: 'Progressive Muscle Relaxation', category: 'relaxation' },
  'grounding-54321': { component: Grounding54321, name: '5-4-3-2-1 Grounding', category: 'grounding' },
  'mindfulness': { component: Mindfulness, name: 'Mindfulness Meditation', category: 'meditation' },
  'thought-record': { component: ThoughtRecord, name: 'CBT Thought Record', category: 'cbt' },
  'distortion-spotter': { component: DistortionSpotter, name: 'Cognitive Distortion Spotter', category: 'cbt' },
  'worry-scheduler': { component: WorryScheduler, name: 'Worry Scheduler', category: 'planning' },
  'behavioral-activation': { component: BehavioralActivation, name: 'Behavioral Activation', category: 'planning' },
}

export default function ExercisePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exercise = EXERCISE_MAP[id]

  if (!exercise) {
    notFound()
  }

  const { component: ExerciseComponent, name, category } = exercise

  const handleComplete = async () => {
    try {
      await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exerciseId: id, exerciseName: name, category }),
      })
    } catch (e) {
      console.error('Failed to track completion', e)
    }
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fffe 100%)' }}>
      <Navigation />
      <main className="max-w-3xl mx-auto px-4 pt-4">
        <ExerciseComponent onComplete={handleComplete} />
      </main>
    </div>
  )
}
