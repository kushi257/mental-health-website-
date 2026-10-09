'use client'

import { useState } from 'react'
import Navigation from '@/components/Navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageCircle, Bot, User, AlertTriangle, ArrowRight, Shield, Heart } from 'lucide-react'

interface Option {
  label: string
  nextId: string
  isCrisis?: boolean
  linkToExercise?: string
}

interface Node {
  id: string
  message: string
  options: Option[]
}

const CHAT_TREE: Record<string, Node> = {
  start: {
    id: 'start',
    message: "Hello! I'm ManoBot, your guided first-response companion. How are you feeling right now?",
    options: [
      { label: "😰 I'm feeling overwhelmed by exams/studies", nextId: 'academic' },
      { label: "😔 I'm feeling low or sad", nextId: 'low_mood' },
      { label: "💤 I can't sleep or stop worrying", nextId: 'anxiety_sleep' },
      { label: "🆘 I feel like I can't cope / thinking of ending my life", nextId: 'crisis', isCrisis: true },
    ],
  },

  academic: {
    id: 'academic',
    message: "Academic pressure is very common among students. What aspect of studies is stressing you out most?",
    options: [
      { label: "Panicking before an upcoming exam", nextId: 'exam_panic' },
      { label: "I keep procrastinating and feeling guilty", nextId: 'procrastination' },
      { label: "I feel like everyone else is smarter than me (Imposter Syndrome)", nextId: 'imposter' },
    ],
  },

  exam_panic: {
    id: 'exam_panic',
    message: "When panic strikes, focusing on your breathing can slow down your heart rate in under 2 minutes. Would you like to try a guided Box Breathing exercise?",
    options: [
      { label: "🌬️ Try Box Breathing now", nextId: 'done', linkToExercise: '/exercises/box-breathing' },
      { label: "📝 Try CBT Thought Record to challenge exam fear", nextId: 'done', linkToExercise: '/exercises/thought-record' },
    ],
  },

  procrastination: {
    id: 'procrastination',
    message: "Procrastination is often about emotion regulation, not laziness! Scheduling one tiny, 5-minute task is the best way to start.",
    options: [
      { label: "📅 Open Behavioral Activation Planner", nextId: 'done', linkToExercise: '/exercises/behavioral-activation' },
      { label: "🎥 Watch micro-video on Procrastination Loop", nextId: 'done', linkToExercise: '/videos' },
    ],
  },

  imposter: {
    id: 'imposter',
    message: "Imposter syndrome tricks us into ignoring our past achievements. Let's spot the cognitive distortions in your thinking.",
    options: [
      { label: "🔍 Spot Cognitive Distortions", nextId: 'done', linkToExercise: '/exercises/distortion-spotter' },
      { label: "📝 Write a CBT Thought Record", nextId: 'done', linkToExercise: '/exercises/thought-record' },
    ],
  },

  low_mood: {
    id: 'low_mood',
    message: "I'm sorry you're feeling down. Small gentle steps can help lift low mood gradually.",
    options: [
      { label: "💪 Try Progressive Muscle Relaxation", nextId: 'done', linkToExercise: '/exercises/pmr' },
      { label: "📅 Schedule a low-effort positive activity", nextId: 'done', linkToExercise: '/exercises/behavioral-activation' },
      { label: "🆘 I feel very hopeless right now", nextId: 'crisis', isCrisis: true },
    ],
  },

  anxiety_sleep: {
    id: 'anxiety_sleep',
    message: "When thoughts run wild at night or during the day, grounding and worry-scheduling give your mind permission to rest.",
    options: [
      { label: "💨 4-7-8 Breathing for Sleep", nextId: 'done', linkToExercise: '/exercises/478-breathing' },
      { label: '⏰ Park your worries in Worry Scheduler', nextId: 'done', linkToExercise: '/exercises/worry-scheduler' },
      { label: '🌿 5-4-3-2-1 Sensory Grounding', nextId: 'done', linkToExercise: '/exercises/grounding-54321' },
    ],
  },

  crisis: {
    id: 'crisis',
    message: 'CRISIS_TRIGGERED',
    options: [],
  },
}

interface MessageHistory {
  sender: 'bot' | 'user'
  text: string
}

export default function ChatbotPage() {
  const router = useRouter()
  const [currentNodeId, setCurrentNodeId] = useState('start')
  const [history, setHistory] = useState<MessageHistory[]>([
    { sender: 'bot', text: CHAT_TREE.start.message },
  ])

  const currentNode = CHAT_TREE[currentNodeId]

  const handleOptionClick = (option: Option) => {
    // Immediate Crisis Check
    if (option.isCrisis || option.nextId === 'crisis' || option.label.toLowerCase().includes('crisis') || option.label.toLowerCase().includes('ending my life')) {
      router.push('/safety?from=chatbot')
      return
    }

    // Add user message to chat history
    const updatedHistory: MessageHistory[] = [
      ...history,
      { sender: 'user', text: option.label },
    ]

    const nextNode = CHAT_TREE[option.nextId]
    if (nextNode) {
      updatedHistory.push({ sender: 'bot', text: nextNode.message })
      setCurrentNodeId(option.nextId)
    }

    setHistory(updatedHistory)

    if (option.linkToExercise) {
      router.push(option.linkToExercise)
    }
  }

  const resetChat = () => {
    setCurrentNodeId('start')
    setHistory([{ sender: 'bot', text: CHAT_TREE.start.message }])
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fffe 100%)' }}>
      <Navigation />

      <main className="max-w-3xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Guided First-Response Chat</h1>
            <p className="text-xs text-teal-600 font-medium">Confidential · Decision-tree guided · Not an AI LLM</p>
          </div>
          <button onClick={resetChat} className="text-xs text-gray-500 underline hover:text-teal-600">
            Reset Chat
          </button>
        </div>

        {/* Emergency top banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-rose-700">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-4 h-4 text-rose-500" />
            In crisis? Need immediate human support?
          </span>
          <a href="tel:14416" className="font-bold underline text-rose-800">Call 14416</a>
        </div>

        {/* Chat window */}
        <div className="glass-card p-6 min-h-[420px] flex flex-col justify-between mb-4">
          <div className="space-y-4 mb-6">
            {history.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 items-start ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${msg.sender === 'bot' ? 'bg-teal-600 text-white' : 'bg-teal-100 text-teal-800'}`}>
                  {msg.sender === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    msg.sender === 'bot'
                      ? 'bg-teal-50/80 border border-teal-100 text-gray-800 rounded-tl-none'
                      : 'bg-teal-600 text-white rounded-tr-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Options Menu */}
          {currentNode && currentNode.options.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-100 animate-slide-up">
              <p className="text-xs text-gray-400 font-semibold mb-2">Choose an option below:</p>
              {currentNode.options.map((opt, i) => (
                <button
                  key={i}
                  id={`chat-opt-${i}`}
                  onClick={() => handleOptionClick(opt)}
                  className={`w-full p-3.5 text-left rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                    opt.isCrisis
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-white border-teal-200 text-teal-900 hover:bg-teal-50 hover:border-teal-400'
                  }`}
                >
                  <span>{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-teal-500 opacity-60" />
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
