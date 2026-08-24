'use client'

import Navigation from '@/components/Navigation'
import { Heart, ShieldCheck, MessageSquareQuote } from 'lucide-react'

const STORIES = [
  {
    id: 1,
    author: '3rd Year Engineering Student',
    title: 'How I bounced back from severe burnout in 4th sem',
    content: "I used to think sleep was a luxury and studying 14 hours a day was normal. By mid-terms, I couldn't focus at all. Using 4-7-8 breathing and setting hard study stop times changed everything.",
    tag: 'Burnout Recovery',
    date: '2 days ago',
  },
  {
    id: 2,
    author: 'Anonymous Freshman',
    title: 'Dealing with extreme homesickness',
    content: "Moving 1,500 km away from home for college was terrifying. I felt completely isolated. Reaching out to the campus counsellor was the best decision I made. You don't have to carry it alone.",
    tag: 'Homesickness',
    date: '5 days ago',
  },
  {
    id: 3,
    author: 'Final Year Medical Student',
    title: 'Overcoming Imposter Syndrome during clinical rotations',
    content: "I kept feeling like I made a mistake choosing this path. Learning about Cognitive Distortions helped me realize my brain was exaggerating my flaws while ignoring my progress.",
    tag: 'Imposter Syndrome',
    date: '1 week ago',
  },
  {
    id: 4,
    author: '2nd Year Humanities Student',
    title: 'Why I stopped hiding my anxiety',
    content: "I thought having panic attacks meant I was weak. Talking to peer supporters made me realize so many of us are going through the exact same struggle.",
    tag: 'Stigma & Hope',
    date: '2 weeks ago',
  },
]

export default function PeerStoriesPage() {
  return (
    <div className="app-page min-h-screen pb-24">
      <Navigation />

      <main className="app-content max-w-3xl mx-auto px-4 pt-4">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Moderated Peer Stories</h1>
            <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-teal-600" /> Moderated
            </span>
          </div>
          <p className="text-gray-500 mt-1">Real coping experiences shared anonymously by fellow college students</p>
        </div>

        <div className="space-y-4">
          {STORIES.map(story => (
            <div key={story.id} className="glass-card p-6 border-l-4 border-teal-500">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
                  #{story.tag}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">{story.date}</span>
              </div>

              <h2 className="font-bold text-gray-800 text-base mb-2">{story.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">
                &ldquo;{story.content}&rdquo;
              </p>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
                <span className="font-medium text-gray-500">🌱 {story.author}</span>
                <span className="flex items-center gap-1 text-teal-600 font-medium">
                  <Heart className="w-3.5 h-3.5 fill-teal-600" /> Inspiring
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
