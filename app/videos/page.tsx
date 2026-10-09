'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/Navigation'
import VideoPlayer from '@/components/VideoPlayer'
import { CheckCircle, Play, Filter, Sparkles, Video, Plus, X, ExternalLink } from 'lucide-react'

interface VideoItem {
  id: string
  youtubeId: string
  title: string
  category: string
  duration: string
  language: string
}

const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    youtubeId: 'hnpQrMqDoqE',
    title: '5-Minute Guided Exercise for Exam Stress & Anxiety',
    category: 'Exam Anxiety',
    duration: '5 min',
    language: 'English / Subtitles',
  },
  {
    id: 'v2',
    youtubeId: 'arj7oStGLkU',
    title: 'Inside the Mind of a Master Procrastinator',
    category: 'Procrastination',
    duration: '14 min',
    language: 'English',
  },
  {
    id: 'v3',
    youtubeId: 'zthFWyMg04Q',
    title: 'What is Imposter Syndrome & How to Combat It',
    category: 'Imposter Syndrome',
    duration: '4 min',
    language: 'English',
  },
  {
    id: 'v4',
    youtubeId: '8Vz14Jp7y40',
    title: 'Managing Stress & Homesickness in College',
    category: 'Homesickness',
    duration: '6 min',
    language: 'English / Hindi',
  },
  {
    id: 'v5',
    youtubeId: 't0kACis8bHA',
    title: 'Sleep Hygiene: How to Fix Your Sleep Schedule',
    category: 'Sleep & Screens',
    duration: '5 min',
    language: 'English',
  },
  {
    id: 'v6',
    youtubeId: 'wOGqlVqyZnU',
    title: 'Understanding Mental Health & Breaking Stigma',
    category: 'Stigma & Myths',
    duration: '5 min',
    language: 'English / Hindi',
  },
]

function extractYoutubeId(urlOrId: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = urlOrId.trim().match(regExp)
  return match && match[2].length === 11 ? match[2] : urlOrId.trim()
}

export default function VideosPage() {
  const [videoList, setVideoList] = useState<VideoItem[]>(DEFAULT_VIDEOS)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(DEFAULT_VIDEOS[0])
  const [playingInlineId, setPlayingInlineId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [watchedSet, setWatchedSet] = useState<Set<string>>(new Set())
  const [showAddForm, setShowAddForm] = useState(false)

  // Form states
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newCategory, setNewCategory] = useState('Exam Anxiety')
  const [newDuration, setNewDuration] = useState('5 min')
  const [newLanguage, setNewLanguage] = useState('English')

  // Load custom videos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('manomitra_custom_videos')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVideoList([...DEFAULT_VIDEOS, ...parsed])
        }
      }
    } catch {}
  }, [])

  const categories = [
    'All',
    'Exam Anxiety',
    'Procrastination',
    'Imposter Syndrome',
    'Homesickness',
    'Sleep & Screens',
    'Stigma & Myths',
  ]

  const filteredVideos =
    selectedCategory === 'All'
      ? videoList
      : videoList.filter((v) => v.category === selectedCategory)

  const handleVideoComplete = (id: string, title: string) => {
    setWatchedSet((prev) => new Set(prev).add(id))
    fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        exerciseId: `video-${id}`,
        exerciseName: title,
        category: 'video',
      }),
    }).catch(() => {})
  }

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault()
    const ytId = extractYoutubeId(newUrl)
    if (!ytId || !newTitle.trim()) return

    const newVideoItem: VideoItem = {
      id: `custom-${Date.now()}`,
      youtubeId: ytId,
      title: newTitle.trim(),
      category: newCategory,
      duration: newDuration || '5 min',
      language: newLanguage || 'English',
    }

    const updated = [newVideoItem, ...videoList]
    setVideoList(updated)
    setSelectedVideo(newVideoItem)

    // Save custom videos to localStorage
    try {
      const customOnly = updated.filter((v) => v.id.startsWith('custom-'))
      localStorage.setItem('manomitra_custom_videos', JSON.stringify(customOnly))
    } catch {}

    // Reset form
    setNewTitle('')
    setNewUrl('')
    setShowAddForm(false)
  }

  return (
    <div
      className="min-h-screen pb-24"
      style={{ background: 'linear-gradient(180deg, #f0fdfa 0%, #f8fffe 100%)' }}
    >
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 pt-6">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Video className="w-7 h-7 text-teal-600" />
              Micro-Learning Video Library
            </h1>
            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Watch bite-sized, practical mental health YouTube videos directly below
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? 'Close' : 'Add YouTube Video'}
            </button>
          </div>
        </div>

        {/* Add Video Form Modal */}
        {showAddForm && (
          <div className="mb-8 p-5 bg-white rounded-2xl border-2 border-teal-500 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <Video className="w-5 h-5 text-teal-600" /> Add YouTube Video to Library
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  YouTube Video Link or Video ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=arj7oStGLkU"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5-Minute Guided Breathing for Stress"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  >
                    {categories
                      .filter((c) => c !== 'All')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    placeholder="e.g. English / Hindi"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 shadow-md"
                >
                  Add Video
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Featured Video Banner / Main Player */}
        <div id="main-player" className="mb-8 scroll-mt-20">
          <VideoPlayer
            youtubeId={selectedVideo.youtubeId}
            title={selectedVideo.title}
            category={selectedVideo.category}
            duration={selectedVideo.duration}
            language={selectedVideo.language}
            isWatched={watchedSet.has(selectedVideo.id)}
            onComplete={() => handleVideoComplete(selectedVideo.id, selectedVideo.title)}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <Filter className="w-4 h-4 text-teal-600 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-teal-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Video Grid (All videos playable inline or in main player) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isSelected = selectedVideo.id === video.id
            const isWatched = watchedSet.has(video.id)
            const isPlayingInline = playingInlineId === video.id

            return (
              <div
                key={video.id}
                className={`glass-card overflow-hidden transition-all border-2 flex flex-col justify-between ${
                  isSelected
                    ? 'border-teal-500 bg-white shadow-xl ring-2 ring-teal-400/30'
                    : 'border-transparent bg-white hover:border-teal-200 hover:shadow-md'
                }`}
              >
                {/* Video Player Box or Thumbnail Header */}
                <div className="relative aspect-video bg-black overflow-hidden">
                  {isPlayingInline ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  ) : (
                    <>
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <button
                          onClick={() => {
                            setPlayingInlineId(video.id)
                            setSelectedVideo(video)
                          }}
                          className="w-14 h-14 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-all group"
                          title="Play Video"
                        >
                          <Play className="w-6 h-6 ml-0.5 fill-current" />
                        </button>
                      </div>
                    </>
                  )}

                  <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-full backdrop-blur-xs z-10">
                    {video.category}
                  </span>
                  {isWatched && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold text-white bg-teal-600 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs z-10">
                      <CheckCircle className="w-3 h-3" /> Watched
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-gray-100 mt-2 space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>⏱️ {video.duration}</span>
                      <span>🌐 {video.language}</span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedVideo(video)
                          setPlayingInlineId(video.id)
                          document.getElementById('main-player')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                          isSelected && isPlayingInline
                            ? 'bg-teal-700 text-white shadow-md'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isPlayingInline ? 'Playing Now' : 'Play Video'}
                      </button>

                      <button
                        onClick={() => handleVideoComplete(video.id, video.title)}
                        disabled={isWatched}
                        className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                          isWatched
                            ? 'bg-teal-100 text-teal-700 cursor-default'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        title={isWatched ? 'Watched' : 'Mark as Watched'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
