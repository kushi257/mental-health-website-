'use client'

import { useState } from 'react'
import { CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

const QUIZ = [
  {
    id: 1,
    scenario: "My friend didn't reply to my text message for 2 hours. They must be mad at me or ignoring me on purpose.",
    options: ['All-or-Nothing Thinking', 'Mind Reading', 'Catastrophizing', 'Emotional Reasoning'],
    correct: 'Mind Reading',
    explanation: 'Mind Reading occurs when we assume we know what others are thinking without real evidence.',
  },
  {
    id: 2,
    scenario: "I got an A on my exam, but I made one silly mistake on question 4. I'm so stupid, I mess everything up.",
    options: ['Mental Filter', 'Overgeneralization', 'Labeling', 'All-or-Nothing Thinking'],
    correct: 'Mental Filter',
    explanation: 'Mental Filter happens when we dwell exclusively on a negative detail and ignore all positive aspects.',
  },
  {
    id: 3,
    scenario: "If I don't get an internship this summer, my whole career is completely ruined.",
    options: ['Catastrophizing', 'Personalization', 'Should Statements', 'Discounting the Positive'],
    correct: 'Catastrophizing',
    explanation: 'Catastrophizing is expecting the worst-case outcome to happen, turning a setback into an absolute disaster.',
  },
  {
    id: 4,
    scenario: "I feel really anxious right now, so something terrible must be about to happen.",
    options: ['Emotional Reasoning', 'Mind Reading', 'Mental Filter', 'Personalization'],
    correct: 'Emotional Reasoning',
    explanation: 'Emotional Reasoning assumes that because we feel a certain way, it must be an objective truth about reality.',
  },
]

export default function DistortionSpotter({ onComplete }: { onComplete: () => void }) {
  const router = useRouter()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = QUIZ[currentIdx]

  const handleSelect = (option: string) => {
    if (submitted) return
    setSelectedOption(option)
  }

  const handleSubmitChoice = () => {
    if (!selectedOption) return
    setSubmitted(true)
    if (selectedOption === q.correct) {
      setScore(s => s + 1)
    }
  }

  const handleNext = () => {
    if (currentIdx < QUIZ.length - 1) {
      setCurrentIdx(i => i + 1)
      setSelectedOption(null)
      setSubmitted(false)
    } else {
      setFinished(true)
      onComplete()
    }
  }

  const handleRestart = () => {
    setCurrentIdx(0)
    setSelectedOption(null)
    setSubmitted(false)
    setScore(0)
    setFinished(false)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cognitive Distortion Spotter</h1>
        <p className="text-gray-500 mt-1">Identify unhelpful thinking traps in everyday scenarios</p>
      </div>

      <div className="glass-card p-8 mb-6">
        {finished ? (
          <div className="text-center animate-grow-in">
            <CheckCircle className="w-16 h-16 text-fuchsia-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete! 🧠</h2>
            <p className="text-gray-600 mb-2 font-medium">
              You scored {score} out of {QUIZ.length}
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Recognizing cognitive distortions is the first step toward healthier thinking habits!
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleRestart} className="btn-secondary">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button onClick={() => router.push('/exercises')} className="btn-primary">
                Library
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-4">
              <span>Scenario {currentIdx + 1} of {QUIZ.length}</span>
              <span className="text-fuchsia-600">Score: {score}</span>
            </div>

            <div className="bg-fuchsia-50/50 border border-fuchsia-100 p-5 rounded-2xl mb-6">
              <p className="text-gray-800 text-lg font-medium italic">
                &ldquo;{q.scenario}&rdquo;
              </p>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">Which cognitive distortion is this?</p>

            <div className="space-y-3 mb-6">
              {q.options.map(opt => {
                let btnStyle = 'border-gray-200 bg-white text-gray-700'
                if (selectedOption === opt) {
                  btnStyle = 'border-fuchsia-500 bg-fuchsia-50 text-fuchsia-800 font-semibold'
                }
                if (submitted) {
                  if (opt === q.correct) {
                    btnStyle = 'border-green-500 bg-green-50 text-green-800 font-bold'
                  } else if (selectedOption === opt && opt !== q.correct) {
                    btnStyle = 'border-red-400 bg-red-50 text-red-700'
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    disabled={submitted}
                    className={`w-full p-4 text-left border-2 rounded-xl text-sm transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>

            {submitted && (
              <div className={`p-4 rounded-xl mb-6 text-sm ${selectedOption === q.correct ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                <p className="font-bold mb-1">
                  {selectedOption === q.correct ? '✨ Correct!' : `❌ Not quite. Correct answer: ${q.correct}`}
                </p>
                <p>{q.explanation}</p>
              </div>
            )}

            {!submitted ? (
              <button
                onClick={handleSubmitChoice}
                disabled={!selectedOption}
                className="btn-primary w-full"
                style={{ opacity: selectedOption ? 1 : 0.5 }}
              >
                Submit Answer
              </button>
            ) : (
              <button onClick={handleNext} className="btn-primary w-full">
                {currentIdx < QUIZ.length - 1 ? 'Next Scenario →' : 'See Results →'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
