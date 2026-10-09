'use client'

import { CheckCircle } from 'lucide-react'

interface VideoPlayerProps {
  youtubeId: string
  title: string
  category: string
  duration: string
  language: string
  isWatched?: boolean
  onComplete?: () => void
}

export default function VideoPlayer({
  youtubeId,
  title,
  category,
  duration,
  language,
  isWatched,
  onComplete,
}: VideoPlayerProps) {
  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
      {/* Video screen container with responsive 16:9 aspect ratio */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}`}
          className="absolute top-0 left-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>

      {/* Video Info & Watch Action Bar */}
      <div className="p-4 bg-gray-950 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 text-xs px-2.5 py-0.5 rounded-full border border-teal-500/30 uppercase tracking-wider font-semibold">
              {category}
            </span>
            <span className="text-xs text-gray-400">⏱️ {duration}</span>
            <span className="text-xs text-gray-400">🌐 {language}</span>
          </div>
          <h3 className="text-white font-bold text-sm sm:text-base">{title}</h3>
        </div>

        <div className="flex-shrink-0 flex items-center">
          {isWatched ? (
            <span className="px-4 py-2 bg-teal-900/50 text-teal-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-teal-500/30">
              <CheckCircle className="w-3.5 h-3.5 text-teal-400" /> Watched
            </span>
          ) : (
            onComplete && (
              <button
                onClick={onComplete}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg hover:shadow-teal-600/20"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Mark as Watched
              </button>
            )
          )}
        </div>
      </div>
    </div>
  )
}
