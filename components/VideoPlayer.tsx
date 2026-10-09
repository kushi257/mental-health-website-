'use client'

import { useState } from 'react'
import { CheckCircle, Play, Sparkles, ExternalLink } from 'lucide-react'

interface VideoPlayerProps {
  youtubeId: string
  title: string
  category: string
  duration: string
  language: string
  onComplete?: () => void
  isWatched?: boolean
}

export default function VideoPlayer({
  youtubeId,
  title,
  category,
  duration,
  language,
  onComplete,
  isWatched = false,
}: VideoPlayerProps) {
  const [completed, setCompleted] = useState(isWatched)

  const handleMarkCompleted = () => {
    setCompleted(true)
    if (onComplete) {
      onComplete()
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 transition-all">
      {/* Video Screen Container with YouTube Embed */}
      <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
        <iframe
          key={youtubeId}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&autoplay=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
        />
      </div>

      {/* Video Controls & Information Bar */}
      <div className="p-4 bg-gray-950 text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-0.5 rounded-full border border-teal-500/30 font-semibold uppercase tracking-wide">
                {category}
              </span>
              <span className="text-xs text-gray-400">⏱️ {duration}</span>
              <span className="text-xs text-gray-400">🌐 {language}</span>
            </div>
            <h2 className="text-white font-bold text-base sm:text-lg leading-snug">{title}</h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleMarkCompleted}
              disabled={completed}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                completed
                  ? 'bg-teal-900/80 text-teal-300 border border-teal-500/40 cursor-default'
                  : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg hover:shadow-teal-500/20'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              {completed ? 'Watched' : 'Mark as Watched'}
            </button>
            <a
              href={`https://www.youtube.com/watch?v=${youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs transition-colors"
              title="Watch on YouTube"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
