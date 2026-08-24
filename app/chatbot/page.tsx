'use client'

import { FormEvent, useState } from 'react'
import Navigation from '@/components/Navigation'
import { useRouter } from 'next/navigation'
import { Bot, User, Shield, Send, RotateCcw, ExternalLink } from 'lucide-react'

interface MessageHistory {
  sender: 'bot' | 'user'
  text: string
}

const initialMessage = "Hello, I'm ManoBot. I'm here to listen and help you find a small next step. What's been on your mind?"

const crisisPattern = /suicid|kill myself|end my life|self[- ]?harm|hurt myself|can't go on|cannot go on|no reason to live|harm someone/i

function getSuggestions(history: MessageHistory[]) {
  const recentUserMessage = [...history].reverse().find(message => message.sender === 'user')?.text || ''
  const lastBotMessage = [...history].reverse().find(message => message.sender === 'bot')?.text || ''
  const conversation = `${recentUserMessage} ${lastBotMessage}`.toLowerCase()
  const turn = history.filter(message => message.sender === 'user').length

  if (crisisPattern.test(conversation)) return []

  const suggestionGroups = [
    /exam|study|college|assignment|deadline|procrastinat/.test(conversation)
      ? ['Break the task into steps', 'Help me choose what to do first', 'I am scared I will fall behind']
      : null,
    /friend|friendship|roommate|relationship|breakup|family|argument|fight/.test(conversation)
      ? ['Help me understand what I feel', 'What could I say to them?', 'I need space before I respond']
      : null,
    /sleep|insomnia|awake|night|tired/.test(conversation)
      ? ['Help me settle down for sleep', 'My mind keeps replaying something', 'Try a short grounding exercise']
      : null,
    /anxious|panic|worried|worry|stress|nervous/.test(conversation)
      ? ['Help me calm my body', 'What part of this can I control?', 'I want to talk about the worry']
      : null,
    /sad|low|empty|hopeless|cry|unhappy|down/.test(conversation)
      ? ['Help me get through the next hour', 'I want to understand this feeling', 'Suggest one gentle action']
      : null,
    /lonely|alone|isolated|nobody|no one/.test(conversation)
      ? ['Help me reach out to someone', 'I want to talk about feeling alone', 'What can I do by myself right now?']
      : null,
  ].filter((group): group is string[] => group !== null)

  const group = suggestionGroups[0] || [
    ['Tell me more about this', 'Help me sort my thoughts', 'I want practical advice'],
    ['What should I do next?', 'I am not sure how I feel', 'Can we look at this another way?'],
    ['Help me make sense of it', 'What might help right now?', 'I want to keep talking'],
  ][turn % 3]

  return group
}

export default function ChatbotPage() {
  const router = useRouter()
  const [history, setHistory] = useState<MessageHistory[]>([
    { sender: 'bot', text: initialMessage },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const suggestedReplies = getSuggestions(history)

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText || loading) return

    if (crisisPattern.test(trimmedText)) {
      router.push('/safety?from=chatbot')
      return
    }

    const nextHistory = [...history, { sender: 'user' as const, text: trimmedText }]
    setHistory(nextHistory)
    setInput('')
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextHistory.slice(1).map(message => ({
            role: message.sender === 'bot' ? 'model' : 'user',
            parts: [{ text: message.text }],
          })),
        }),
      })
      const result = await response.json() as { reply?: string; error?: string }
      if (!response.ok || !result.reply) throw new Error(result.error || 'Unable to get a reply.')
      setHistory(current => [...current, { sender: 'bot', text: result.reply || '' }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to get a reply right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(input)
  }

  const resetChat = () => {
    setHistory([{ sender: 'bot', text: initialMessage }])
    setInput('')
    setError('')
  }

  return (
    <div className="app-page min-h-screen pb-24">
      <Navigation />

      <main className="app-content max-w-3xl mx-auto px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Guided First-Response Chat</h1>
            <p className="text-xs text-teal-600 font-medium">Confidential · Guided support companion · Not a licensed counsellor</p>
          </div>
          <button onClick={resetChat} className="text-xs text-gray-500 hover:text-teal-600 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Chat
          </button>
        </div>

        {/* Emergency top banner */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex items-center justify-between text-xs text-rose-700">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield className="w-4 h-4 text-rose-500" />
            In crisis? Need immediate human support?
          </span>
          <span className="flex items-center gap-3">
            <a href="tel:14416" className="font-bold underline text-rose-800">Call 14416</a>
            <a
              href="https://telemanas.mohfw.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Tele-MANAS website"
              title="Open Tele-MANAS website"
              className="inline-flex items-center gap-1 font-bold underline text-rose-800"
            >
              Tele-MANAS website
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </span>
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
                  } whitespace-pre-wrap break-words`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-teal-600 text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-teal-50 border border-teal-100 text-gray-500 text-sm">
                  ManoBot is thinking...
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="mb-3 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">{error}</p>
          )}

          {suggestedReplies.length > 0 && !loading && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-semibold mb-2">You could say:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedReplies.map(reply => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => void sendMessage(reply)}
                    className="chat-suggestion px-3 py-2 rounded-full text-xs font-semibold border bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100 hover:border-teal-400 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4">
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              placeholder="Type how you feel..."
              aria-label="Message ManoBot"
              disabled={loading}
              className="input-field flex-1 rounded-full py-3"
            />
            <button type="submit" disabled={loading || !input.trim()} aria-label="Send message" className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
