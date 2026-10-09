'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, ChevronLeft, Brain, Heart } from 'lucide-react'
import { PHQ9_QUESTIONS, GAD7_QUESTIONS, ANSWER_OPTIONS, QUESTION_ANSWER_OPTIONS } from '@/lib/scoring'

export default function ScreenerPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'intro' | 'phq9' | 'gad7' | 'submitting'>('intro')
  const [phq9Answers, setPhq9Answers] = useState<number[]>(new Array(9).fill(-1))
  const [gad7Answers, setGad7Answers] = useState<number[]>(new Array(7).fill(-1))
  const [currentQ, setCurrentQ] = useState(0)
  const [loading, setLoading] = useState(false)

  const questions = phase === 'phq9' ? PHQ9_QUESTIONS : GAD7_QUESTIONS
  const answers = phase === 'phq9' ? phq9Answers : gad7Answers
  const setAnswers = phase === 'phq9' ? setPhq9Answers : setGad7Answers
  const questionIndex = phase === 'phq9' ? currentQ : PHQ9_QUESTIONS.length + currentQ
  const answerOptions = QUESTION_ANSWER_OPTIONS[questionIndex] || ANSWER_OPTIONS

  const setAnswer = (val: number) => {
    const updated = [...answers]
    updated[currentQ] = val
    setAnswers(updated)
  }

  const canNext = answers[currentQ] !== -1

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else if (phase === 'phq9') {
      setPhase('gad7')
      setCurrentQ(0)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
    } else if (phase === 'gad7') {
      setPhase('phq9')
      setCurrentQ(PHQ9_QUESTIONS.length - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setPhase('submitting')
    try {
      const res = await fetch('/api/screener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phq9Answers, gad7Answers }),
      })
      const data = await res.json()

      // Set screener done cookie via a simple fetch
      document.cookie = 'screenerDone=1; path=/; max-age=2592000'

      if (data.tier === 'HIGH') {
        router.push('/safety?from=screener')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setLoading(false)
      setPhase('gad7')
    }
  }

  const totalQuestions = PHQ9_QUESTIONS.length + GAD7_QUESTIONS.length
  const answeredSoFar =
    phq9Answers.filter(a => a !== -1).length +
    (phase === 'gad7' ? gad7Answers.filter(a => a !== -1).length : 0)
  const progress = (answeredSoFar / totalQuestions) * 100

  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 gradient-soft">
        <div className="max-w-lg w-full">
          <div className="glass-card p-8 text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-3">A quick check-in</h1>
            <p className="text-gray-600 mb-6">
              We&apos;ll ask you 16 brief questions about how you&apos;ve been feeling over the last 2 weeks. This helps us personalise your experience.
            </p>
            <div className="space-y-3 text-left mb-8">
              {[
                '📋 PHQ-9: 9 questions about mood & depression',
                '😰 GAD-7: 7 questions about anxiety',
                '⏱️ Takes about 3 minutes',
                '🔒 Your answers are private and confidential',
              ].map(item => (
                <div key={item} className="flex items-center gap-3 bg-teal-50 p-3 rounded-xl">
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <button
                id="start-screener-btn"
                onClick={() => setPhase('phq9')}
                className="btn-primary w-full"
              >
                Start check-in
              </button>
              <button
                id="skip-screener-btn"
                onClick={async () => {
                  document.cookie = 'screenerDone=1; path=/; max-age=2592000'
                  router.push('/dashboard')
                }}
                className="w-full py-2.5 text-xs text-gray-500 font-semibold hover:text-teal-700 transition-colors"
              >
                Skip for now → Go to Dashboard
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              These are validated clinical screening tools, not a diagnosis.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'submitting') {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-soft">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Analysing your responses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gradient-soft">
      <div className="max-w-lg w-full">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500 font-medium">
              {phase === 'phq9' ? 'PHQ-9' : 'GAD-7'}: Question {currentQ + 1} of {questions.length}
            </span>
            <span className="text-sm text-teal-600 font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          {phase === 'phq9'
            ? <Heart className="w-5 h-5 text-rose-500" />
            : <Brain className="w-5 h-5 text-violet-500" />}
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {phase === 'phq9' ? 'Mood & Wellbeing' : 'Anxiety & Worry'}
          </span>
        </div>

        <div className="glass-card p-8 animate-slide-up" key={`${phase}-${currentQ}`}>
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            Over the last 2 weeks, how often have you been bothered by...
          </p>
          <h2 className="text-xl font-semibold text-gray-800 mb-8 leading-snug">
            {questions[currentQ]}
          </h2>

          <div className="space-y-3">
            {answerOptions.map(opt => (
              <button
                key={opt.value}
                id={`answer-${opt.value}`}
                onClick={() => setAnswer(opt.value)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left"
                style={{
                  borderColor: answers[currentQ] === opt.value ? '#0d9488' : '#e2e8f0',
                  background: answers[currentQ] === opt.value ? '#f0fdfa' : 'white',
                }}
              >
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: answers[currentQ] === opt.value ? '#0d9488' : '#cbd5e1',
                    background: answers[currentQ] === opt.value ? '#0d9488' : 'white',
                  }}
                >
                  {answers[currentQ] === opt.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                </div>
                <span className={`font-medium ${answers[currentQ] === opt.value ? 'text-teal-700' : 'text-gray-700'}`}>
                  {opt.label}
                </span>
                <span className="ml-auto text-sm font-bold text-gray-400">{opt.value}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            {(currentQ > 0 || phase === 'gad7') && (
              <button
                id="back-btn"
                onClick={handleBack}
                className="btn-secondary flex-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              id="next-btn"
              onClick={handleNext}
              disabled={!canNext || loading}
              className="btn-primary flex-1"
              style={{ opacity: canNext ? 1 : 0.5 }}
            >
              {currentQ === questions.length - 1 && phase === 'gad7' ? 'Submit' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Question {currentQ + 1} of {questions.length} ({phase === 'phq9' ? 'PHQ-9' : 'GAD-7'})
        </p>
      </div>
    </div>
  )
}
